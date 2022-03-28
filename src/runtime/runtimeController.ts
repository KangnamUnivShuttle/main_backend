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
    Response
  } from "tsoa";
import { postRequestToInstance } from "../lib/internalRequest";
import logger from "../logger";
import { KakaoChatReqModel, KakaoChatResModel } from "../models/kakaochat.model";
import { PluginInfoModel } from "../models/plugin.model";
import { BasicResponseModel } from "../models/response.model";
import { RuntimeControlModel, RuntimeHashmapModel, RuntimePayloadModel } from "../models/runtime.model";
import { ERROR_CHAT_RESPONSE_MSG_EMPTY_RUNTIME, ERROR_CHAT_RESPONSE_MSG_SYSTEM_ERROR, ERROR_CHAT_RESPONSE_MSG_UNDEFINED_RECOMMAND_KEY } from "../types/global.types";
import { getRecentUserState, returnErrorMessage, updateUserState } from "./runtimeHandler";
import { getBestRuntimeChoice, getRuntimePayload } from './runtimeLoader'
import { exec, execFile, fork, spawn } from "child_process";
import { ChatBlockRuntime } from "../orm/entities/ChatBlockRuntime";
import { getConnection } from "typeorm";

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
     * @summary 런타임 내용 확인
     * @param blockID 런타임 idx
     * @param page 페이지 번호
     * @param limit 한 페이지에 렌더링 할 데이터 건 수
     * @returns 특정 런타임 세부 정보 혹은 런타임 목록
     */
    @Security('passport-cookie')
    @Get()
    public async getInfo(
        @Query() page: number = 1,
        @Query() limit: number = 10,
        @Query() blockID?: string
    ): Promise<BasicResponseModel> {
        return {

        } as BasicResponseModel;
    }

    /**
     * @summary 런타임 등록
     */
    @Security('passport-cookie')
    @Post("register")
    public async registerNewRuntime(): Promise<BasicResponseModel> {
        return {

        } as BasicResponseModel;
    }

    controlCLI (container: RuntimeControlModel): Promise<number> {
        return new Promise<number>((resolve, rejects) => {
            const process = spawn('jingisukan', ['service', '--name', container.container_name, '--path', `./${container.container_name}`, '--status', container.container_state]);
    
            logger.debug(`[runtimeController] [containerStateControl] container : ${container.container_name} state: ${container.container_state}`)

            process.stdout.on('data', (data) => {
                logger.debug(`[runtimeController] [containerStateControl] ${data}`)
                // console.log(`spawn stdout: ${data}`);
            });
            process.stderr.on('data', (data) => {
                logger.error(`[runtimeController] [containerStateControl] ${data}`)
            });
            process.on('exit', (code, signal) => {
                logger.debug(`[runtimeController] [containerStateControl] spawn on exit code: ${code} signal: ${signal}`)

                if (code === 0) {
                    resolve(code)
                } else {
                    rejects(new Error(`Exit code is not zero.`))
                }
            });
        })
    }

    /**
     * 
     * @param input 
     * @returns 
     */
    @Security('passport-cookie')
    @Post("state")
    public async containerStateControl(
        @Body() body: RuntimeControlModel
    ): Promise<BasicResponseModel> {

        const result = {
            success: false
        } as BasicResponseModel;

        try {
            const code = await this.controlCLI(body);

            const connection = getConnection();
            const queryRunner = await connection.createQueryRunner()
            const queryBuilder = await connection.createQueryBuilder(ChatBlockRuntime, 'registerPlugin', queryRunner);
            await queryRunner.startTransaction()
            try {
                logger.debug(`[runtimeController] [containerStateControl] update data: ${JSON.stringify(body)}`)
                
                queryBuilder.update(ChatBlockRuntime)
                .set({
                    containerState: body.container_state
                })
                .where('blockRuntimeID = :blockRuntimeID', {blockRuntimeID: body.blockRuntimeID})
                .execute()

                await queryRunner.commitTransaction();
                logger.debug(`[runtimeController] [containerStateControl] update runtime state ok`)
                result.success = true
            } catch(err: any) {
                await queryRunner.rollbackTransaction();
                logger.error(`[runtimeController] [containerStateControl] update runtime state failed ${err.message}`)
                result.success = false
                result.message = err.message
            } finally {
                await queryRunner.release();
                logger.info(`[runtimeController] [containerStateControl] update runtime state done`)
            }
        } catch (e: any) {
            logger.error(`[runtimeController] [containerStateControl] error :${e.message}`)
            result.message = e.message
        }
        return result
    }

    requestLocalPlugin(input: KakaoChatReqModel): Promise<any> {
        return new Promise<any>(() => {});
    }

    @Response<KakaoChatResModel>(200, 'Response ok')
    @Post('kakaochat')
    public async kakaoChatRuntime(
        @Body() body: KakaoChatReqModel
    ): Promise<KakaoChatResModel> {
        const userKey = body.userRequest.user.id
        const currentUserRecentBlockId = await getRecentUserState(userKey)

        logger.debug(`[runtimeController] [kakaoChatRuntime] current user: ${userKey} blockID: ${currentUserRecentBlockId}`)

        const selectedkey = await getBestRuntimeChoice(body.userRequest.utterance, currentUserRecentBlockId) 
        const currentRuntime = await getRuntimePayload(selectedkey)

        await updateUserState(userKey, selectedkey || 'intro')

        if (selectedkey) {
            logger.info(`[runtimeController] [kakaoChatRuntime] Current runtime is ${selectedkey}`)
        } else {
            logger.warn(`[runtimeController] [kakaoChatRuntime] Runtime not selected.`)
        }

        if (currentRuntime) {
            try {
                if (currentRuntime.pluginList.length <= 0) {
                    logger.error(`[runtimeController] [kakaoChatRuntime] This runtime(${selectedkey})'s plugin list is empty.`)
                    return returnErrorMessage(ERROR_CHAT_RESPONSE_MSG_EMPTY_RUNTIME)
                }

                let payload = body as any
                for (let idx = 0; idx < currentRuntime.pluginList.length; idx ++) {
                    currentRuntime.processResult.push(await postRequestToInstance(currentRuntime.pluginList[idx].url, payload, currentRuntime.pluginList[idx].port))
                    payload = currentRuntime.processResult[currentRuntime.processResult.length - 1]
                }

                return payload
            } catch (err: unknown) {
                // https://stackoverflow.com/a/64452744/7270469
                if (err instanceof Error) {
                    logger.error(`[runtimeController] [kakaoChatRuntime] Runtime error detected. ${err.message}`)
                    return returnErrorMessage();
                } else {
                    logger.error(`[runtimeController] [kakaoChatRuntime] Undefined runtime error detected.`)
                    return returnErrorMessage(ERROR_CHAT_RESPONSE_MSG_SYSTEM_ERROR);
                }
            }
        }

        logger.error(`[runtimeController] [kakaoChatRuntime] Undefined chat request type: ${selectedkey}`)
        return returnErrorMessage(ERROR_CHAT_RESPONSE_MSG_UNDEFINED_RECOMMAND_KEY);
    }

    /**
     * @summary 런타임 실행
     * @param rid 실행할 런타임 idx
     */
    @Post("execute/{rid}")
    public async execute(
        @Path() rid: number
    ): Promise<BasicResponseModel> {



        return {

        } as BasicResponseModel;
    }

    /**
     * @summary 런타임 수정
     * @param rid 수정할 런타임 idx
     */
    @Security('passport-cookie')
    @Put("modify")
    public async modifyRuntime(): Promise<BasicResponseModel> {
        return {

        } as BasicResponseModel;
    }

    /**
     * @summary 런타임 삭제
     * @param rid 삭제할 런타임 idx
     */
    @Security('passport-cookie')
    @Delete("{rid}")
    public async deleteRuntime(
        @Path() rid: number
    ): Promise<BasicResponseModel> {
        return {

        } as BasicResponseModel;
    }
}