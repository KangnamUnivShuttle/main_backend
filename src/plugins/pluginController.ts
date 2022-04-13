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
import { PAGE_SIZE } from "../types/global.types";

@Tags("Plugin")
@Route("plugin")
export class PluginController extends Controller {

  /**
   * @summary 설치된 플러그인의 세부 정보를 반환
   * @param imageID 특정 플러그인 idx 에 해당하는 정보 반환, null 이면 리스트 반환
   * @param page 페이지 번호
   * @param limit 한 페이지에 렌더링 할 데이터 건 수
   * 
   */
  @Security('passport-cookie')
  @Get()
  public async getInfo(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() name?: string,
    @Query() imageID?: string
  ): Promise<BasicResponseModel> {

    const result = {
      success: false
    } as BasicResponseModel;

    try {
      const connection = getConnection();
      const queryRunner = await connection.createQueryRunner()
      const queryBuilder = await connection.createQueryBuilder(ChatImage, 'registerPlugin', queryRunner);

      // https://jojoldu.tistory.com/579
      let query = queryBuilder.select([
        '_ChatImage.imageId',
        '_ChatImage.name',
        '_ChatImage.orderNum',
        '_ChatImage.githubUrl',
        '_ChatImage.registerDatetime',
        '_ChatImage.updateDatetime'
      ])
      .from(ChatImage, '_ChatImage')

      // https://github.com/typeorm/typeorm/issues/3103#issuecomment-445497288
      if (imageID) {
        query = query.where("_ChatImage.imageId = :imageID", { imageID })
      }
      if (name) {
        query = query.where("_ChatImage.name like :name", {name})
      }
      const pluginList = await query.orderBy('_ChatImage.order_num', 'ASC')
      .limit(limit)
      .offset((page - 1) * limit)
      .getMany()

      queryRunner.release()

      result.success = true
      result.data = pluginList
    } catch (err: any) { 
      logger.error(`[PluginController] [getInfo] failed to load chat image data ${err.message}`)
      result.message = err.message
    }
    return result;
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
      logger.error(`[PluginController] [registerPlugin] Add new plugin failed ${err.message}`)
      result.success = false
      result.message = err.message
    } finally {
      await queryRunner.release();
      logger.info(`[PluginController] [registerPlugin] Add new plugin done`)
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

    const result = {
      success: false
    } as BasicResponseModel

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner()
    const queryBuilder = await connection.createQueryBuilder(ChatImage, 'registerPlugin', queryRunner);
    await queryRunner.startTransaction()
    try {
      logger.debug(`[PluginController] [modifyPlugin] Modify data: ${JSON.stringify(body)}`)
      queryBuilder.update(ChatImage)
      .set({
        name: body.name,
        orderNum: body.order_num,
        updateDatetime: 'current_timestamp()'
      })
      .where('imageID = :imageID', {imageID: body.imageID})
      .execute()

      await queryRunner.commitTransaction();
      logger.debug(`[PluginController] [modifyPlugin] Modify data ok`)
      result.success = true
    } catch(err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(`[PluginController] [modifyPlugin] Modify data error ${err.message}`)
      result.success = false
      result.message = err.message
    } finally {
      await queryRunner.release();
      logger.info(`[PluginController] [modifyPlugin] Modify data done`)
    }
    return result
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

    const result = {
      success: false
    } as BasicResponseModel

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner()
    const queryBuilder = await connection.createQueryBuilder(ChatImage, 'registerPlugin', queryRunner);
    await queryRunner.startTransaction()
    try {
      logger.debug(`[PluginController] [deletePlugin] Delete data #${imageID}`)

      queryBuilder.delete()
      .from(ChatImage)
      .where("imageID = :imageID", {imageID})
      .execute()

      await queryRunner.commitTransaction();

      logger.debug(`[PluginController] [deletePlugin] Delete data done`)
    } catch(err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(`[PluginController] [deletePlugin] Delete data error ${err.message}`)
      result.success = false
      result.message = err.message
    } finally {
      await queryRunner.release();
      logger.info(`[PluginController] [deletePlugin] Delete data done`)
    }
    return result
  }
}