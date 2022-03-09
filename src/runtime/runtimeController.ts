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
import { BasicResponseModel } from "../models/response.model";
import { RuntimeHashmapModel, RuntimePayloadModel } from "../models/runtime.model";
import { ERROR_CHAT_RESPONSE_MSG_SYSTEM_ERROR, ERROR_CHAT_RESPONSE_MSG_UNDEFINED_RECOMMAND_KEY } from "../types/global.types";
import { returnErrorMessage } from "./runtimeHandler";

  @Tags("Runtime")
  @Route("runtime")
  export class RuntimeController extends Controller {

    /**
     * @summary 런타임 내용 확인
     * @param rid 런타임 idx
     * @param page 페이지 번호
     * @param limit 한 페이지에 렌더링 할 데이터 건 수
     * @returns 특정 런타임 세부 정보 혹은 런타임 목록
     */
    @Security('passport-cookie')
    @Get()
    public async getInfo(
        @Query() page: number = 1,
        @Query() limit: number = 10,
        @Query() rid?: number
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

    requestLocalPlugin(input: KakaoChatReqModel): Promise<any> {
        return new Promise<any>(() => {});
    }

    @Response<KakaoChatResModel>(200, 'Response ok')
    @Post('kakaochat')
    public async kakaoChatRuntime(
        @Body() body: KakaoChatReqModel
    ): Promise<KakaoChatResModel> {

        const kakaoChatRuntimeHashmap: RuntimeHashmapModel = {
            'sample_weather': {
                pluginList: [],
                kakaoChatPayload: body,
                processResult: []
            } as RuntimePayloadModel
        };

        const selectedkey = 'sample_weather'

        if (kakaoChatRuntimeHashmap.hasOwnProperty(selectedkey)) {
            try {
                const currentRuntime = kakaoChatRuntimeHashmap[selectedkey]
                let payload = body as any
                for (let idx = 0; idx < currentRuntime.pluginList.length; idx ++) {
                    currentRuntime.processResult.push(await postRequestToInstance(currentRuntime.pluginList[idx].url, payload))
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