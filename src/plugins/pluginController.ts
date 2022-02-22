import {
    Controller,
    Get,
    Route,
    Tags,
    Query,
    Path,
    Post,
    Put,
    Delete,
    Security
  } from "tsoa";
import { BasicResponseModel } from "../models/response.model";

  @Tags("Plugin")
  @Route("plugin")
  export class PluginController extends Controller {

    /**
     * @summary 설치된 플러그인의 세부 정보를 반환
     * @param pid 특정 플러그인 idx 에 해당하는 정보 반환, null 이면 리스트 반환
     * @param page 페이지 번호
     * @param limit 한 페이지에 렌더링 할 데이터 건 수
     * 
     */
    @Security('passport-cookie')
    @Get()
    public async getInfo(
        @Query() page: number = 1,
        @Query() limit: number = 10,
        @Query() pid?: number
    ): Promise<BasicResponseModel> {
      return {} as BasicResponseModel;
    }

    /**
     * @summary 새로운 플러그인 설치
     * @returns 등록 성공 / 실패 여부
     */
    @Security('passport-cookie')
    @Post()
    public async registerPlugin(): Promise<BasicResponseModel> {
      return {} as BasicResponseModel;
    }

    /**
     * @summary 기존 설치된 플러그인 변경
     * 
     */
    @Security('passport-cookie')
    @Put()
    public async modifyPlugin(): Promise<BasicResponseModel> {
      return {} as BasicResponseModel;
    }

    /**
     * @summary 기존 설치된 플러그인 삭제
     * @param pid 삭제할 플러그인 idx
     */
    @Security('passport-cookie')
    @Delete("{pid}")
    public async deletePlugin(
        @Path() pid: number
    ): Promise<BasicResponseModel> {
      return {} as BasicResponseModel;
    }
}