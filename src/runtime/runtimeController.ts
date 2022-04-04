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
import { RuntimeControlModel, RuntimeHashmapModel, RuntimeModel, RuntimePayloadModel } from "../models/runtime.model";
import { BLOCK_ID_FALLBACK, ERROR_CHAT_RESPONSE_MSG_EMPTY_RUNTIME, ERROR_CHAT_RESPONSE_MSG_SYSTEM_ERROR, ERROR_CHAT_RESPONSE_MSG_UNDEFINED_RECOMMAND_KEY } from "../types/global.types";
import { getRecentUserState, openFallbackBlock, returnErrorMessage, returnRecommendedMessage, updateUserState } from "./runtimeHandler";
import { getBestRuntimeChoice, getRecommendedReplyList, getRuntimePayload } from './runtimeLoader'
import { exec, execFile, fork, spawn } from "child_process";
import { ChatBlockRuntime } from "../orm/entities/ChatBlockRuntime";
import { getConnection } from "typeorm";
import { controlCLI, genDockerCompose, genDockerfile, genEcoSystem, genEnvFile } from "./runtimeCliController";

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
     * @param blockRuntimeID 런타임 idx
     * @param page 페이지 번호
     * @param limit 한 페이지에 렌더링 할 데이터 건 수
     * @returns 특정 런타임 세부 정보 혹은 런타임 목록
     */
    @Security('passport-cookie')
    @Get()
    public async getInfo(
        @Query() page: number = 1,
        @Query() limit: number = 10,
        @Query() blockRuntimeID?: number,
        @Query() blockID?: string,
    ): Promise<BasicResponseModel> {
        const result = {
            success: false
        } as BasicResponseModel;

        const connection = getConnection();
        const queryRunner = await connection.createQueryRunner()
        const queryBuilder = await connection.createQueryBuilder(ChatBlockRuntime, 'registerPlugin', queryRunner);
        try {

            // https://jojoldu.tistory.com/579
            let query = queryBuilder.select([
                '_ChatBlockRuntime.blockRuntimeId',
                '_ChatBlockRuntime.blockId',
                '_ChatBlockRuntime.imageId',
                '_ChatBlockRuntime.orderNum',
                '_ChatBlockRuntime.containerUrl',
                '_ChatBlockRuntime.containerPort',
                '_ChatBlockRuntime.containerEnv',
                '_ChatBlockRuntime.containerState',
                '_ChatBlockRuntime.registerDatetime',
                '_ChatBlockRuntime.updateDatetime',
            ])
                .from(ChatBlockRuntime, '_ChatBlockRuntime')

            // https://github.com/typeorm/typeorm/issues/3103#issuecomment-445497288
            if (blockRuntimeID) {
                query = query.where("_ChatBlockRuntime.blockRuntimeId = :blockRuntimeID", { blockRuntimeID })
            }
            if (blockID) {
                query = query.where("_ChatBlockRuntime.blockId = :blockID", { blockID })
            }
            const runtimeList = await query.orderBy('_ChatBlockRuntime.orderNum', 'ASC')
                .limit(limit)
                .offset((page - 1) * limit)
                .getMany()

            result.success = true
            result.data = runtimeList
        } catch (err: any) {
            logger.error(`[runtimeController] [getInfo] failed to load chat image data ${err.message}`)
            result.message = err.message
        } finally {
            queryRunner.release()
        }
        return result;
    }

    /**
     * @summary 런타임 등록
     */
    @Security('passport-cookie')
    @Post("register")
    public async registerNewRuntime(@Body() body: RuntimeModel): Promise<BasicResponseModel> {

        const result = {
            success: false
        } as BasicResponseModel;

        const connection = getConnection();
        const queryRunner = await connection.createQueryRunner()
        const queryBuilder = await connection.createQueryBuilder(ChatBlockRuntime, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()
        try {
            logger.debug(`[runtimeController] [registerNewRuntime] add new data: ${JSON.stringify(body)}`)

            queryBuilder.insert()
                .into(ChatBlockRuntime)
                .values([
                    {
                        blockId: body.blockID,
                        imageId: body.imageID,
                        orderNum: body.order_num,
                        // containerUrl: body.container_url,
                        // containerPort: body.container_port,
                        containerEnv: body.container_env,
                    }
                ])
                .execute();
            await queryRunner.commitTransaction();
            logger.debug(`[runtimeController] [registerNewRuntime] add new runtime ok`)
            result.success = true
        } catch (err: any) {
            await queryRunner.rollbackTransaction();
            logger.error(`[runtimeController] [registerNewRuntime] add new runtime failed ${err.message}`)
            result.success = false
            result.message = err.message
        } finally {
            await queryRunner.release();
            logger.info(`[runtimeController] [registerNewRuntime] add new runtime done`)
        }

        return result
    }

    async recentRuntimeState(blockRuntimeID: number): Promise<ChatBlockRuntime | undefined> {
        const connection = getConnection();
        const queryRunner = await connection.createQueryRunner()
        const queryBuilder = await connection.createQueryBuilder(ChatBlockRuntime, 'asdfsadf', queryRunner);

        let runtime = undefined;
        try {
            logger.debug(`[runtimeController] [recentRuntimeState] get block runtime ${blockRuntimeID}`)
            
            // https://jojoldu.tistory.com/579
            runtime = await queryBuilder.select([
                '_ChatBlockRuntime.blockRuntimeId',
                '_ChatBlockRuntime.blockId',
                '_ChatBlockRuntime.imageId',
                '_ChatBlockRuntime.orderNum',
                '_ChatBlockRuntime.containerUrl',
                '_ChatBlockRuntime.containerPort',
                '_ChatBlockRuntime.containerEnv',
                '_ChatBlockRuntime.containerState',
                '_ChatBlockRuntime.registerDatetime',
                '_ChatBlockRuntime.updateDatetime',
            ])
            .from(ChatBlockRuntime, '_ChatBlockRuntime')
            .where("_ChatBlockRuntime.blockRuntimeId = :blockRuntimeID", { blockRuntimeID })
            .getOne()

            logger.debug(`[runtimeController] [recentRuntimeState] block runtime ${JSON.stringify(runtime)}`)
        } catch (e: any) {
            logger.error(`[runtimeController] [recentRuntimeState] error: ${e.message}`)
        } finally {
            queryRunner.release()
            logger.info(`[runtimeController] [recentRuntimeState] done`)
        }
        return Promise.resolve(runtime);
    }

    async updateContainerStateToDB(runtime: RuntimeControlModel): Promise<BasicResponseModel> {
        const result = {
            success: false
        } as BasicResponseModel

        const connection = getConnection();
        const queryRunner = await connection.createQueryRunner()
        const queryBuilder = await connection.createQueryBuilder(ChatBlockRuntime, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()
        try {
            logger.debug(`[runtimeController] [updateContainerStateToDB] update data: ${JSON.stringify(runtime)}`)

            queryBuilder.update(ChatBlockRuntime)
                .set({
                    containerState: runtime.container_state,
                    containerUrl: runtime.container_name,
                    updateDatetime: 'current_timestamp()'
                })
                .where('blockRuntimeId = :blockRuntimeID', { blockRuntimeID: runtime.blockRuntimeID })
                .execute()

            await queryRunner.commitTransaction();
            logger.debug(`[runtimeController] [updateContainerStateToDB] update runtime state ok`)
            result.success = true
        } catch (err: any) {
            await queryRunner.rollbackTransaction();
            logger.error(`[runtimeController] [updateContainerStateToDB] update runtime state failed ${err.message}`)
            result.success = false
            result.message = err.message
        } finally {
            await queryRunner.release();
            logger.info(`[runtimeController] [updateContainerStateToDB] update runtime state done`)
        }
        return Promise.resolve(result)
    }

    /**
     * @summary 런타임 컨테이너 관리 API
     * @param input 
     * @returns 
     */
    @Security('passport-cookie')
    @Post("state")
    public async containerStateControl(
        @Body() body: RuntimeControlModel
    ): Promise<BasicResponseModel> {

        logger.debug(`[runtimeController] [containerStateControl] payload: ${JSON.stringify(body)}`)

        const result = {
            success: false
        } as BasicResponseModel;

        try {
            const recentRuntime = await this.recentRuntimeState(body.blockRuntimeID)

            logger.debug(`[runtimeController] [containerStateControl] recentRuntime ${JSON.stringify(recentRuntime)}`)

            // 이미 컨테이너가 있는 상태일때
            if (recentRuntime && recentRuntime.containerUrl) {
                logger.info(`[runtimeController] [containerStateControl] runtime already exist in ${recentRuntime.containerUrl}:${recentRuntime.containerPort} / ${recentRuntime.containerState}`)
                
                const code = await controlCLI({
                    container_name: recentRuntime.containerUrl,
                    container_state: body.container_state,
                    path: process.env.PLUGIN_PATH || '.'
                } as RuntimeControlModel);    
                logger.debug(`[runtimeController] [containerStateControl] code: ${code}`)
                const result_db = await this.updateContainerStateToDB({
                    blockRuntimeID: body.blockRuntimeID,
                    container_state: body.container_state,
                    container_name: recentRuntime.containerUrl,
                    path: process.env.PLUGIN_PATH || '.'
                } as RuntimeControlModel)
                logger.debug(`[runtimeController] [containerStateControl] write result to db: ${result_db.success}`)

                result.success = true
            } else { // 컨테이너 새로 만들때
                let init_result = await genDockerCompose(body.container_name, process.env.PLUGIN_PATH || '.')
                logger.debug(`[runtimeController] [containerStateControl] init result docker-compose: ${JSON.stringify(init_result)}`)

                init_result = await genDockerfile(body.image_url, body.container_name, process.env.PLUGIN_PATH || '.')
                logger.debug(`[runtimeController] [containerStateControl] init result dockerfile: ${JSON.stringify(init_result)}`)

                init_result = await genEcoSystem(body.container_name, process.env.PLUGIN_PATH || '.')
                logger.debug(`[runtimeController] [containerStateControl] init result ecosystem: ${JSON.stringify(init_result)}`)

                init_result = await genEnvFile(body.container_name, process.env.PLUGIN_PATH || '.', body.env)
                logger.debug(`[runtimeController] [containerStateControl] init result ecosystem: ${JSON.stringify(init_result)}`)

                body.path = process.env.PLUGIN_PATH || '.'
                const code = await controlCLI(body);

                logger.debug(`[runtimeController] [containerStateControl] control code: ${code}`)

                const result_db = await this.updateContainerStateToDB({
                    container_name: body.container_name,
                    container_state: body.container_state,
                    blockRuntimeID: body.blockRuntimeID
                } as RuntimeControlModel);
                result.success = result_db.success;
                result.message = result_db.message;
            }
        } catch (e: any) {
            logger.error(`[runtimeController] [containerStateControl] error :${e.message}`)
            result.message = e.message
        }
        return result
    }

    requestLocalPlugin(input: KakaoChatReqModel): Promise<any> {
        return new Promise<any>(() => { });
    }

    @Response<KakaoChatResModel>(200, 'Response ok')
    @Post('kakaochat')
    public async kakaoChatRuntime(
        @Body() body: KakaoChatReqModel
    ): Promise<KakaoChatResModel> {
        const userKey = body.userRequest.user.id
        const {blockID: currentUserRecentBlockId, inputMsg} = await getRecentUserState(userKey)

        logger.debug(`[runtimeController] [kakaoChatRuntime] current user: ${userKey} blockID: ${currentUserRecentBlockId}`)

        const selectedkey = (await getBestRuntimeChoice(body.userRequest.utterance, currentUserRecentBlockId)) || BLOCK_ID_FALLBACK

        const currentRuntime = await getRuntimePayload(selectedkey)

        await updateUserState(userKey, selectedkey, body.userRequest.utterance)

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
                for (let idx = 0; idx < currentRuntime.pluginList.length; idx++) {
                    currentRuntime.processResult.push(await postRequestToInstance(`plugin_node_${currentRuntime.pluginList[idx].url}`, payload, currentRuntime.pluginList[idx].port))
                    payload = currentRuntime.processResult[currentRuntime.processResult.length - 1]
                }

                payload['template']['quickReplies'] = []
                currentRuntime.nextBlock.forEach(block => {
                    payload['template']['quickReplies'].push(block.quickReply)  
                })

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
        } else if(selectedkey === BLOCK_ID_FALLBACK) { // recommend what user will want
            logger.warn(`[runtimeController] [kakaoChatRuntime] current selected key is in fallback block`)

            const randomNextBlockList = await getRecommendedReplyList();
            await openFallbackBlock(userKey, currentUserRecentBlockId, randomNextBlockList)

            return returnRecommendedMessage(randomNextBlockList)
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
    public async modifyRuntime(@Body() body: RuntimeModel): Promise<BasicResponseModel> {

        const result = {
            success: false
        } as BasicResponseModel;

        const connection = getConnection();
        const queryRunner = await connection.createQueryRunner()
        const queryBuilder = await connection.createQueryBuilder(ChatBlockRuntime, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()
        try {
            logger.debug(`[runtimeController] [modifyRuntime] Modify data: ${JSON.stringify(body)}`)
            queryBuilder.update(ChatBlockRuntime)
                .set({
                    imageId: body.imageID,
                    orderNum: body.order_num,
                    containerEnv: body.container_env,
                    updateDatetime: 'current_timestamp()'
                })
                .where('blockRuntimeId = :blockRuntimeID', { blockRuntimeID: body.blockRuntimeID })
                .execute()

            await queryRunner.commitTransaction();
            logger.debug(`[runtimeController] [modifyRuntime] Modify data ok`)
            result.success = true
        } catch (err: any) {
            await queryRunner.rollbackTransaction();
            logger.error(`[runtimeController] [modifyRuntime] Modify data error ${err.message}`)
            result.success = false
            result.message = err.message
        } finally {
            await queryRunner.release();
            logger.info(`[runtimeController] [modifyRuntime] Modify data done`)
        }
        return result
    }

    /**
     * @summary 런타임 삭제
     * @param blockRuntimeID 삭제할 런타임 idx
     */
    @Security('passport-cookie')
    @Delete("{blockRuntimeID}")
    public async deleteRuntime(
        @Path() blockRuntimeID: number
    ): Promise<BasicResponseModel> {

        const result = {
            success: false
        } as BasicResponseModel;

        const connection = getConnection();
        const queryRunner = await connection.createQueryRunner()
        const queryBuilder = await connection.createQueryBuilder(ChatBlockRuntime, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()
        try {
            logger.debug(`[runtimeController] [deleteRuntime] delete data: ${blockRuntimeID}`)
            queryBuilder.delete()
            .from(ChatBlockRuntime)
            .where('blockRuntimeID = :blockRuntimeID', { blockRuntimeID: blockRuntimeID })
            .execute()

            await queryRunner.commitTransaction();
            logger.debug(`[runtimeController] [deleteRuntime] delete data ok`)
            result.success = true
        } catch (err: any) {
            await queryRunner.rollbackTransaction();
            logger.error(`[runtimeController] [deleteRuntime] delete data error ${err.message}`)
            result.success = false
            result.message = err.message
        } finally {
            await queryRunner.release();
            logger.info(`[runtimeController] [deleteRuntime] delete data done`)
        }
        return result
    }
}