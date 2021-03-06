import {
  Controller,
  Get,
  Post,
  Route,
  Tags,
  Query,
  Path,
  Put,
  Delete,
  Security,
  Body,
  Response,
} from "tsoa";
import { performance } from "perf_hooks";
import { postRequestToInstance } from "../lib/internalRequest";
import logger from "../logger";
import {
  KakaoChatReqModel,
  KakaoChatResModel,
} from "../models/kakaochat.model";
import { PluginInfoModel } from "../models/plugin.model";
import { BasicResponseModel } from "../models/response.model";
import {
  RuntimeControlModel,
  RuntimeHashmapModel,
  RuntimeModel,
  RuntimePayloadModel,
} from "../models/runtime.model";
import {
  BLOCK_ID_FALLBACK,
  ERROR_CHAT_RESPONSE_MSG_EMPTY_RUNTIME,
  ERROR_CHAT_RESPONSE_MSG_SYSTEM_ERROR,
  ERROR_CHAT_RESPONSE_MSG_UNDEFINED_RECOMMAND_KEY,
  FALLBACK_ESCAPE_BLOCK_ID,
  FALLBACK_ESCAPE_MSG,
} from "../types/global.types";
import {
  getRecentUserState,
  openFallbackBlock,
  returnErrorMessage,
  returnRecommendedMessage,
  updateUserState,
  writeFallbackEscapeLog,
} from "./runtimeHandler";
import {
  getBestRuntimeChoice,
  getFallbackRuntimePayload,
  getRecommendedReplyList,
  getRuntimePayload,
} from "./runtimeLoader";
import { exec, execFile, fork, spawn } from "child_process";
import { ChatBlockRuntime } from "../orm/entities/ChatBlockRuntime";
import { getConnection } from "typeorm";
import {
  controlCLI,
  genDockerCompose,
  genDockerfile,
  genEcoSystem,
  genEnvFile,
} from "./runtimeCliController";
import { pagingQuerySelection, pagingUnionQuery } from "../lib/queryUtils";
import { ChatTraffic } from "../orm/entities/ChatTraffic";

@Tags("Runtime")
@Route("runtime")
export class RuntimeController extends Controller {
  // delete from chat_image;
  // delete from chat_block;
  // delete from chat_block_link;
  // delete from chat_block_runtime;

  // insert into chat_image(imageID, name, order_num, github_url) values (1, 'test1-1', 1, 'url'), (2, 'test1-2', 2, 'url'), (3, 'test2-1', 3, 'url');
  // insert into chat_block(blockID, name, order_num, enabled) VALUES('intro', 'intro', 1, 1), ('hello', 'hello world', 2, 1);
  // insert into chat_block_link(blockLinkID, blockID, order_num, nextBlockID, label) VALUES(1, 'intro', 1, 'hello', 'go to hello'), (2, 'intro', 1, 'intro', 'go to intro'), (3, 'hello', 3, 'intro', 'go to intro from hello');
  // insert into chat_block_runtime (blockRuntimeID, blockID, imageID, order_num) values (1, 'intro', 1, 1), (2, 'intro', 2, 2), (3, 'hello', 3, 3);

  /**
   * @summary ????????? ?????? ??????
   * @param blockRuntimeID ????????? idx
   * @param page ????????? ??????
   * @param limit ??? ???????????? ????????? ??? ????????? ??? ???
   * @returns ?????? ????????? ?????? ?????? ?????? ????????? ??????
   */
  @Security("passport-cookie")
  @Get()
  public async getInfo(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() blockRuntimeID?: number,
    @Query() blockID?: string
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();

    const queryBuilder = await connection.createQueryBuilder(
      ChatBlockRuntime,
      "_ChatBlockRuntime",
      queryRunner
    );

    const countQueryBuilder = await connection.createQueryBuilder(
      ChatBlockRuntime,
      "_ChatBlockRuntime",
      queryRunner
    );
    try {
      const { countCols, dataCols } = pagingQuerySelection(
        "_ChatBlockRuntime",
        [
          "blockRuntimeId",
          "blockId",
          "imageId",
          "x",
          "y",
          "orderNum",
          "containerUrl",
          "containerPort",
          "containerEnv",
          "containerState",
          "registerDatetime",
          "updateDatetime",
        ],
        "_ChatBlockRuntime.blockRuntimeId"
      );
      let cntQuery = countQueryBuilder
        .select(countCols)
        // .from(ChatBlockRuntime, "_ChatBlockRuntime")
        .leftJoinAndSelect("_ChatBlockRuntime.image", "_ChatImage");
      // https://jojoldu.tistory.com/579
      let query = queryBuilder
        .select(dataCols)
        // .from(ChatBlockRuntime, "_ChatBlockRuntime")
        .leftJoinAndSelect("_ChatBlockRuntime.image", "_ChatImage");

      // https://github.com/typeorm/typeorm/issues/3103#issuecomment-445497288
      if (blockRuntimeID) {
        query = query.where(
          `_ChatBlockRuntime.blockRuntimeId = ${blockRuntimeID}`
        );
        cntQuery = cntQuery.where(
          `_ChatBlockRuntime.blockRuntimeId = ${blockRuntimeID}`
        );
      }
      if (blockID) {
        query = query.where(`_ChatBlockRuntime.blockId = '${blockID}'`);
        cntQuery = cntQuery.where(`_ChatBlockRuntime.blockId = '${blockID}'`);
      }
      const dataQuery = query
        .orderBy("_ChatBlockRuntime.orderNum", "ASC")
        .limit(limit)
        .offset((page - 1) * limit)
        .getQuery();

      const countQuery = cntQuery.getQuery();

      result.success = true;
      result.data = await pagingUnionQuery(
        countQuery,
        dataQuery,
        [],
        "order by `orderNum` ASC"
      );
    } catch (err: any) {
      logger.error(
        `[runtimeController] [getInfo] failed to load chat image data ${err.message}`
      );
      result.message = err.message;
    } finally {
      queryRunner.release();
    }
    return result;
  }

  /**
   * @summary ????????? ??????
   */
  @Security("passport-cookie")
  @Post("register")
  public async registerNewRuntime(
    @Body() body: RuntimeModel
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlockRuntime,
      "registerPlugin",
      queryRunner
    );
    await queryRunner.startTransaction();
    try {
      logger.debug(
        `[runtimeController] [registerNewRuntime] add new data: ${JSON.stringify(
          body
        )}`
      );

      queryBuilder
        .insert()
        .into(ChatBlockRuntime)
        .values([
          {
            blockId: body.blockID,
            imageId: body.imageID,
            orderNum: body.order_num,
            // containerUrl: body.container_url,
            containerPort: body.container_port,
            containerEnv: body.container_env,
            x: body.x,
            y: body.y,
          },
        ])
        .execute();
      await queryRunner.commitTransaction();
      logger.debug(
        `[runtimeController] [registerNewRuntime] add new runtime ok`
      );
      result.success = true;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(
        `[runtimeController] [registerNewRuntime] add new runtime failed ${err.message}`
      );
      result.success = false;
      result.message = err.message;
    } finally {
      await queryRunner.release();
      logger.info(
        `[runtimeController] [registerNewRuntime] add new runtime done`
      );
    }

    return result;
  }

  async recentRuntimeState(
    blockRuntimeID: number
  ): Promise<ChatBlockRuntime | undefined> {
    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlockRuntime,
      "asdfsadf",
      queryRunner
    );

    let runtime = undefined;
    try {
      logger.debug(
        `[runtimeController] [recentRuntimeState] get block runtime ${blockRuntimeID}`
      );

      // https://jojoldu.tistory.com/579
      runtime = await queryBuilder
        .select([
          "_ChatBlockRuntime.blockRuntimeId",
          "_ChatBlockRuntime.blockId",
          "_ChatBlockRuntime.imageId",
          "_ChatBlockRuntime.orderNum",
          "_ChatBlockRuntime.containerUrl",
          "_ChatBlockRuntime.containerPort",
          "_ChatBlockRuntime.containerEnv",
          "_ChatBlockRuntime.containerState",
          "_ChatBlockRuntime.registerDatetime",
          "_ChatBlockRuntime.updateDatetime",
        ])
        .from(ChatBlockRuntime, "_ChatBlockRuntime")
        .where("_ChatBlockRuntime.blockRuntimeId = :blockRuntimeID", {
          blockRuntimeID,
        })
        .getOne();

      logger.debug(
        `[runtimeController] [recentRuntimeState] block runtime ${JSON.stringify(
          runtime
        )}`
      );
    } catch (e: any) {
      logger.error(
        `[runtimeController] [recentRuntimeState] error: ${e.message}`
      );
    } finally {
      queryRunner.release();
      logger.info(`[runtimeController] [recentRuntimeState] done`);
    }
    return Promise.resolve(runtime);
  }

  async updateContainerStateToDB(
    runtime: RuntimeControlModel
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlockRuntime,
      "registerPlugin",
      queryRunner
    );
    await queryRunner.startTransaction();
    try {
      logger.debug(
        `[runtimeController] [updateContainerStateToDB] update data: ${JSON.stringify(
          runtime
        )}`
      );

      if (runtime.env) {
        queryBuilder
          .update(ChatBlockRuntime)
          .set({
            containerState: runtime.container_state,
            containerUrl: runtime.container_name,
            updateDatetime: "current_timestamp()",
            containerEnv: runtime.env.join("\n"),
          })
          .where("blockRuntimeId = :blockRuntimeID", {
            blockRuntimeID: runtime.blockRuntimeID,
          })
          .execute();
      } else {
        queryBuilder
          .update(ChatBlockRuntime)
          .set({
            containerState: runtime.container_state,
            containerUrl: runtime.container_name,
            updateDatetime: "current_timestamp()",
          })
          .where("blockRuntimeId = :blockRuntimeID", {
            blockRuntimeID: runtime.blockRuntimeID,
          })
          .execute();
      }

      await queryRunner.commitTransaction();
      logger.debug(
        `[runtimeController] [updateContainerStateToDB] update runtime state ok`
      );
      result.success = true;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(
        `[runtimeController] [updateContainerStateToDB] update runtime state failed ${err.message}`
      );
      result.success = false;
      result.message = err.message;
    } finally {
      await queryRunner.release();
      logger.info(
        `[runtimeController] [updateContainerStateToDB] update runtime state done`
      );
    }
    return Promise.resolve(result);
  }

  /**
   * @summary ????????? ???????????? ?????? API
   * @param input
   * @returns
   */
  @Security("passport-cookie")
  @Post("state")
  public async containerStateControl(
    @Body() body: RuntimeControlModel
  ): Promise<BasicResponseModel> {
    logger.debug(
      `[runtimeController] [containerStateControl] payload: ${JSON.stringify(
        body
      )}`
    );

    const result = {
      success: false,
    } as BasicResponseModel;

    try {
      const recentRuntime = await this.recentRuntimeState(body.blockRuntimeID);

      logger.debug(
        `[runtimeController] [containerStateControl] recentRuntime ${JSON.stringify(
          recentRuntime
        )}`
      );

      // ?????? ??????????????? ?????? ????????????
      if (recentRuntime && recentRuntime.containerUrl) {
        logger.info(
          `[runtimeController] [containerStateControl] runtime already exist in ${recentRuntime.containerUrl}:${recentRuntime.containerPort} / ${recentRuntime.containerState}`
        );

        const selectedEnv =
          body.env || (recentRuntime.containerEnv || "").split("\n");
        const init_result = await genEnvFile(
          body.container_name,
          process.env.PLUGIN_PATH || ".",
          body.env || (recentRuntime.containerEnv || "").split("\n")
        );
        logger.debug(
          `[runtimeController] [containerStateControl] init result env: ${JSON.stringify(
            init_result
          )}`
        );

        const cliResult = await controlCLI({
          container_name: recentRuntime.containerUrl,
          container_state: body.container_state,
          path: process.env.PLUGIN_PATH || ".",
        } as RuntimeControlModel);
        logger.debug(
          `[runtimeController] [containerStateControl] code: ${cliResult.code}`
        );
        const result_db = await this.updateContainerStateToDB({
          blockRuntimeID: body.blockRuntimeID,
          container_state:
            body.container_state === "build"
              ? recentRuntime.containerState
              : body.container_state,
          container_name: recentRuntime.containerUrl,
          env: selectedEnv,
          path: process.env.PLUGIN_PATH || ".",
        } as RuntimeControlModel);
        logger.debug(
          `[runtimeController] [containerStateControl] write result to db: ${result_db.success}`
        );

        result.success = true;
        result.message = cliResult.msg;
      } else {
        // ???????????? ?????? ?????????
        let init_result = await genDockerCompose(
          body.container_name,
          process.env.PLUGIN_PATH || "."
        );
        logger.debug(
          `[runtimeController] [containerStateControl] init result docker-compose: ${JSON.stringify(
            init_result
          )}`
        );

        init_result = await genDockerfile(
          body.image_url,
          body.container_name,
          process.env.PLUGIN_PATH || "."
        );
        logger.debug(
          `[runtimeController] [containerStateControl] init result dockerfile: ${JSON.stringify(
            init_result
          )}`
        );

        init_result = await genEcoSystem(
          body.container_name,
          process.env.PLUGIN_PATH || "."
        );
        logger.debug(
          `[runtimeController] [containerStateControl] init result ecosystem: ${JSON.stringify(
            init_result
          )}`
        );

        init_result = await genEnvFile(
          body.container_name,
          process.env.PLUGIN_PATH || ".",
          body.env
        );
        logger.debug(
          `[runtimeController] [containerStateControl] init result env: ${JSON.stringify(
            init_result
          )}`
        );

        body.path = process.env.PLUGIN_PATH || ".";
        const cliResult = await controlCLI(body);

        logger.debug(
          `[runtimeController] [containerStateControl] control code: ${cliResult.code}`
        );

        const result_db = await this.updateContainerStateToDB({
          container_name: body.container_name,
          container_state: body.container_state,
          blockRuntimeID: body.blockRuntimeID,
          env: body.env,
        } as RuntimeControlModel);
        result.success = result_db.success;
        result.message = `${result_db.message}\n${cliResult.msg}`;
      }
    } catch (e: any) {
      logger.error(
        `[runtimeController] [containerStateControl] error :${e.message}`
      );
      result.message = e.message;
    }
    return result;
  }

  async chatTrafficLogger(
    userKey: string,
    blockID: string,
    msg: string | null,
    beforeBlockID?: string,
    beforeMsg?: string | null
  ) {
    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatTraffic,
      "_ChatTraffic",
      queryRunner
    );
    await queryRunner.startTransaction();
    try {
      logger.debug(
        `[runtimeController] [chatTrafficLogger] write data: ${userKey} / ${blockID} / ${msg}`
      );

      queryBuilder
        .insert()
        .into(ChatTraffic)
        .values([
          {
            userKey,
            blockId: blockID,
            msg: msg,
            beforeBlockId: beforeBlockID,
            beforeMsg: beforeMsg,
          },
        ])
        .execute();

      await queryRunner.commitTransaction();
      logger.debug(`[runtimeController] [chatTrafficLogger] commit data ok`);
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(
        `[runtimeController] [chatTrafficLogger] commit data error ${err.message}`
      );
    } finally {
      await queryRunner.release();
      logger.info(`[runtimeController] [chatTrafficLogger] transaction done`);
    }
  }

  async blockKeySelector(
    currentUserRecentBlockId: string,
    messageText: string,
    lastRuntimeKey: string | undefined
  ) {
    logger.debug(
      `[runtimeController] [blockKeySelector] current: ${currentUserRecentBlockId} / msg: ${messageText} / last: ${lastRuntimeKey}`
    );
    // fallback ???????????? ?????? ?????? ?????? ???
    if (
      currentUserRecentBlockId === BLOCK_ID_FALLBACK &&
      messageText === FALLBACK_ESCAPE_MSG
    ) {
      logger.debug(
        `[runtimeController] [blockKeySelector] Request escape fallback block.`
      );
      return FALLBACK_ESCAPE_BLOCK_ID;
    } else {
      const bestChoice = await getBestRuntimeChoice(
        messageText,
        lastRuntimeKey
      );

      // ?????? ????????? ????????? ??? ?????? ?????? ??? ????????? ?????? ??????
      if (bestChoice) {
        logger.debug(
          `[runtimeController] [blockKeySelector] Best choice block exist.`
        );
        return bestChoice;
      }
      // ??? ????????? ????????? ????????? ?????? ????????? ?????? ??????????????? ???????????? ??? ?????? ??????
      else if (
        currentUserRecentBlockId !== BLOCK_ID_FALLBACK &&
        (await getRuntimePayload(currentUserRecentBlockId)).block_loopable === 1
      ) {
        logger.debug(
          `[runtimeController] [blockKeySelector] Loop mode enabled block.`
        );
        return currentUserRecentBlockId;
      }
      // ??? ???????????? fallback ??????
      else {
        logger.debug(`[runtimeController] [blockKeySelector] Start fallback.`);
        return BLOCK_ID_FALLBACK;
      }
    }
  }

  async executeRuntime(
    currentRuntime: RuntimePayloadModel,
    selectedkey: string,
    body: any
  ) {
    try {
      if (currentRuntime.pluginList.length <= 0) {
        logger.error(
          `[runtimeController] [executeRuntime] This runtime(${selectedkey})'s plugin list is empty.`
        );
        return returnErrorMessage(ERROR_CHAT_RESPONSE_MSG_EMPTY_RUNTIME);
      }

      let payload = body as any;
      for (let idx = 0; idx < currentRuntime.pluginList.length; idx++) {
        const startTime = performance.now();
        currentRuntime.processResult.push(
          await postRequestToInstance(
            `plugin_node_${currentRuntime.pluginList[idx].url}`,
            payload,
            currentRuntime.pluginList[idx].port
          )
        );
        const endTime = performance.now();
        payload =
          currentRuntime.processResult[currentRuntime.processResult.length - 1];
        logger.debug(
          `[runtimeController] [executeRuntime] took ${Math.floor(
            endTime - startTime
          )} milliseconds`
        );
        logger.debug(
          `[runtimeController] [executeRuntime] next payload: ${JSON.stringify(
            payload
          )}`
        );
      }

      payload["template"]["quickReplies"] = [];
      currentRuntime.nextBlock.sort(
        (a, b) => (a.link_order_num || 0) - (b.link_order_num || 0)
      );
      currentRuntime.nextBlock.forEach((block) => {
        payload["template"]["quickReplies"].push(block.quickReply);
      });

      return payload;
    } catch (err: unknown) {
      // https://stackoverflow.com/a/64452744/7270469
      if (err instanceof Error) {
        logger.error(
          `[runtimeController] [executeRuntime] Runtime error detected. ${err.message}`
        );
        return returnErrorMessage();
      } else {
        logger.error(
          `[runtimeController] [executeRuntime] Undefined runtime error detected.`
        );
        return returnErrorMessage(ERROR_CHAT_RESPONSE_MSG_SYSTEM_ERROR);
      }
    }
  }

  @Response<KakaoChatResModel>(200, "Response ok")
  @Post("executeRuntime")
  @Security("passport-cookie")
  public async executeRuntimeTest(
    @Body() body: KakaoChatReqModel
  ): Promise<KakaoChatResModel> {
    const selectedkey = body.intent?.id || "intro";
    const currentRuntime = await getRuntimePayload(selectedkey);
    return this.executeRuntime(currentRuntime, selectedkey, body);
  }

  @Response<KakaoChatResModel>(200, "Response ok")
  @Post("kakaochat")
  public async kakaoChatRuntime(
    @Body() body: KakaoChatReqModel
  ): Promise<KakaoChatResModel> {
    const userKey = body.userRequest.user.id;
    const messageText = body.userRequest.utterance;
    const { blockID: currentUserRecentBlockId, inputMsg } =
      await getRecentUserState(userKey);

    logger.debug(
      `[runtimeController] [kakaoChatRuntime] current user: ${userKey} blockID: ${currentUserRecentBlockId}`
    );
    const lastRuntimeKey =
      currentUserRecentBlockId === BLOCK_ID_FALLBACK
        ? await getFallbackRuntimePayload(userKey, messageText)
        : currentUserRecentBlockId;

    logger.debug(
      `[runtimeController] [kakaoChatRuntime] last runtime key: ${lastRuntimeKey}`
    );

    const selectedkey = await this.blockKeySelector(
      currentUserRecentBlockId,
      messageText,
      lastRuntimeKey
    );

    this.chatTrafficLogger(
      userKey,
      selectedkey,
      messageText,
      currentUserRecentBlockId,
      inputMsg
    );

    if (
      selectedkey !== BLOCK_ID_FALLBACK &&
      currentUserRecentBlockId === BLOCK_ID_FALLBACK
    ) {
      logger.debug(
        `[runtimeController] [kakaoChatRuntime] Hurry! User escaped fallback block! Now: ${selectedkey}`
      );
      await writeFallbackEscapeLog(userKey, selectedkey);
    }

    const currentRuntime = await getRuntimePayload(selectedkey);

    await updateUserState(userKey, selectedkey, messageText);

    if (selectedkey) {
      logger.info(
        `[runtimeController] [kakaoChatRuntime] Current runtime is ${selectedkey}`
      );
    } else {
      logger.warn(
        `[runtimeController] [kakaoChatRuntime] Runtime not selected.`
      );
    }

    if (currentRuntime) {
      return this.executeRuntime(currentRuntime, selectedkey, body);
    } else if (selectedkey === BLOCK_ID_FALLBACK) {
      // recommend what user will want
      logger.warn(
        `[runtimeController] [kakaoChatRuntime] current selected key is in fallback block`
      );

      const randomNextBlockList = await getRecommendedReplyList();
      await openFallbackBlock(
        userKey,
        currentUserRecentBlockId,
        randomNextBlockList,
        messageText
      );

      return returnRecommendedMessage(randomNextBlockList);
    }

    logger.error(
      `[runtimeController] [kakaoChatRuntime] Undefined chat request type: ${selectedkey}`
    );
    return returnErrorMessage(ERROR_CHAT_RESPONSE_MSG_UNDEFINED_RECOMMAND_KEY);
  }

  /**
   * @summary ????????? ??????
   * @param rid ????????? ????????? idx
   */
  @Post("execute/{rid}")
  public async execute(@Path() rid: number): Promise<BasicResponseModel> {
    return {} as BasicResponseModel;
  }

  /**
   * @summary ????????? ??????
   * @param rid ????????? ????????? idx
   */
  @Security("passport-cookie")
  @Put("modify")
  public async modifyRuntime(
    @Body() body: RuntimeModel
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlockRuntime,
      "registerPlugin",
      queryRunner
    );
    await queryRunner.startTransaction();
    try {
      logger.debug(
        `[runtimeController] [modifyRuntime] Modify data: ${JSON.stringify(
          body
        )}`
      );
      queryBuilder
        .update(ChatBlockRuntime)
        .set({
          imageId: body.imageID,
          orderNum: body.order_num,
          containerEnv: body.container_env,
          x: body.x,
          y: body.y,
          updateDatetime: "current_timestamp()",
        })
        .where("blockRuntimeId = :blockRuntimeID", {
          blockRuntimeID: body.blockRuntimeID,
        })
        .execute();

      await queryRunner.commitTransaction();
      logger.debug(`[runtimeController] [modifyRuntime] Modify data ok`);
      result.success = true;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(
        `[runtimeController] [modifyRuntime] Modify data error ${err.message}`
      );
      result.success = false;
      result.message = err.message;
    } finally {
      await queryRunner.release();
      logger.info(`[runtimeController] [modifyRuntime] Modify data done`);
    }
    return result;
  }

  /**
   * @summary ????????? ??????
   * @param blockRuntimeID ????????? ????????? idx
   */
  @Security("passport-cookie")
  @Delete("{blockRuntimeID}")
  public async deleteRuntime(
    @Path() blockRuntimeID: number
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlockRuntime,
      "registerPlugin",
      queryRunner
    );
    await queryRunner.startTransaction();
    try {
      logger.debug(
        `[runtimeController] [deleteRuntime] delete data: ${blockRuntimeID}`
      );
      queryBuilder
        .delete()
        .from(ChatBlockRuntime)
        .where("blockRuntimeID = :blockRuntimeID", {
          blockRuntimeID: blockRuntimeID,
        })
        .execute();

      await queryRunner.commitTransaction();
      logger.debug(`[runtimeController] [deleteRuntime] delete data ok`);
      result.success = true;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(
        `[runtimeController] [deleteRuntime] delete data error ${err.message}`
      );
      result.success = false;
      result.message = err.message;
    } finally {
      await queryRunner.release();
      logger.info(`[runtimeController] [deleteRuntime] delete data done`);
    }
    return result;
  }
}
