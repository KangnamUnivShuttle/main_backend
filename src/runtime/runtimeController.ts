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
    Body
  } from "tsoa";
import { KakaoChatReqModel } from "../models/kakaochat.model";
import { BasicResponseModel } from "../models/response.model";

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

    @Post('kakaochat')
    public async kakaoChatRuntime(
        @Body() body: KakaoChatReqModel
    ): Promise<any> {



        return {};
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