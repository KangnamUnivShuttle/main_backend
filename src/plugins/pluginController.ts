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
  Security,
  Body
} from "tsoa";
import { BasicResponseModel } from "../models/response.model";
import { getConnection } from "typeorm";
import { ChatImage } from "../orm/entities/ChatImage";
import { PlugInImageModel } from "../models/plugin.model";
import logger from "../logger";

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
  public async registerPlugin(@Body() body: PlugInImageModel): Promise<BasicResponseModel> {

    const result = {
      success: false
    } as BasicResponseModel

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner()
    const queryBuilder = await connection.createQueryBuilder(ChatImage, 'registerPlugin', queryRunner);
    await queryRunner.startTransaction()
    try {
      logger.debug(`[PluginController] [registerPlugin] Add new data: ${JSON.stringify(body)}`)
      queryBuilder.insert().into(ChatImage)
      .values([
        {
          name: body.name,
          orderNum: body.order_num,
          githubUrl: body.github_url,
        }
      ])
      await queryRunner.commitTransaction();
      logger.debug(`[PluginController] [registerPlugin] Add new plugin ok`)
      result.success = true
    } catch(err: any) {
      await queryRunner.rollbackTransaction();
      logger.debug(`[PluginController] [registerPlugin] Add new plugin failed ${err.message}`)
      result.success = false
      result.message = err.message
    } finally {
      await queryRunner.release();
      logger.debug(`[PluginController] [registerPlugin] Add new plugin done`)
    }
    return result;
  }

  /**
   * @summary 기존 설치된 플러그인 변경
   * 
   */
  @Security('passport-cookie')
  @Put()
  public async modifyPlugin(@Body() body: PlugInImageModel): Promise<BasicResponseModel> {
    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner()
    const queryBuilder = await connection.createQueryBuilder(ChatImage, 'registerPlugin', queryRunner);
    await queryRunner.startTransaction()
    try {
        await queryRunner.commitTransaction();
    } catch(err: any) {
        await queryRunner.rollbackTransaction();
    } finally {
        await queryRunner.release();
    }
    return {} as BasicResponseModel;
  }

  /**
   * @summary 기존 설치된 플러그인 삭제
   * @param imageID 삭제할 플러그인 idx
   */
  @Security('passport-cookie')
  @Delete("{imageID}")
  public async deletePlugin(
    @Path() imageID: number
  ): Promise<BasicResponseModel> {
    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner()
    const queryBuilder = await connection.createQueryBuilder(ChatImage, 'registerPlugin', queryRunner);
    await queryRunner.startTransaction()
    try {
        await queryRunner.commitTransaction();
    } catch(err: any) {
        await queryRunner.rollbackTransaction();
    } finally {
        await queryRunner.release();
    }
    return {} as BasicResponseModel;
  }
}