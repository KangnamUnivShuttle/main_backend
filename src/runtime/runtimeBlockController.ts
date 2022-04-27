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
import { BasicResponseModel } from "../models/response.model";
import { getConnection } from "typeorm";
import logger from "../logger";
import { ChatBlock } from "../orm/entities/ChatBlock";
import { RuntimeBlockModel } from "../models/runtime.model";
import { pagingQuerySelection, pagingUnionQuery } from "../lib/queryUtils";

@Tags("RuntimeBlock")
@Route("runtimeBlock")
export class RuntimeBlockController extends Controller {
  @Security("passport-cookie")
  @Get()
  public async getInfo(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() blockID?: string,
    @Query() name?: string
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlock,
      "_ChatBlock",
      queryRunner
    );

    const countQueryBuilder = await connection.createQueryBuilder(
      ChatBlock,
      "_ChatBlock",
      queryRunner
    );
    try {
      const { countCols, dataCols } = pagingQuerySelection("_ChatBlock", [
        "blockId",
        "name",
        "enabled",
        "x",
        "y",
        "linkX",
        "linkY",
        "orderNum",
        "deleteable",
        "loopable",
        "registerDatetime",
        "updateDatetime",
      ]);
      let cntQuery = countQueryBuilder.select(countCols);
      // .from(ChatBlock, "_ChatBlock");

      // https://jojoldu.tistory.com/579
      let query = queryBuilder.select(dataCols);
      //   .from(ChatBlock, "_ChatBlock");

      // https://github.com/typeorm/typeorm/issues/3103#issuecomment-445497288
      if (blockID) {
        query = query.where(`_ChatBlock.blockId = '${blockID}'`);
        cntQuery = cntQuery.where(`_ChatBlock.blockId = '${blockID}'`);
      }
      if (name) {
        query = query.where(`_ChatBlock.name like '%${name}%'`);
        cntQuery = cntQuery.where(`_ChatBlock.name like '%${name}%'`);
      }
      const dataQuery = query
        .orderBy("_ChatBlock.registerDatetime", "DESC")
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
        `[runtimeBlockController] [getInfo] failed to load chat image data ${err.message}`
      );
      result.message = err.message;
    } finally {
      queryRunner.release();
    }
    return result;
  }

  @Security("passport-cookie")
  @Post()
  public async insert(
    @Body() body: RuntimeBlockModel
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlock,
      "registerPlugin",
      queryRunner
    );
    await queryRunner.startTransaction();
    try {
      logger.debug(
        `[runtimeBlockController] [insert] insert data: ${JSON.stringify(body)}`
      );

      queryBuilder
        .insert()
        .into(ChatBlock)
        .values([
          {
            blockId: body.blockID,
            name: body.name,
            enabled: body.enabled,
            orderNum: body.order_num,
            x: body.x,
            y: body.y,
            linkX: body.linkX,
            linkY: body.linkY,
            loopable: body.loopable,
          },
        ])
        .execute();

      await queryRunner.commitTransaction();
      logger.debug(`[runtimeBlockController] [insert] insert data ok`);
      result.success = true;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(
        `[runtimeBlockController] [insert] insert data error ${err.message}`
      );
      result.success = false;
      result.message = err.message;
    } finally {
      await queryRunner.release();
      logger.info(`[runtimeBlockController] [insert] insert data done`);
    }
    return result;
  }

  @Security("passport-cookie")
  @Put()
  public async update(
    @Body() body: RuntimeBlockModel
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlock,
      "registerPlugin",
      queryRunner
    );
    await queryRunner.startTransaction();
    try {
      logger.debug(
        `[runtimeBlockController] [update] update data: ${JSON.stringify(body)}`
      );

      queryBuilder
        .update(ChatBlock)
        .set({
          name: body.name,
          enabled: body.enabled,
          orderNum: body.order_num,
          x: body.x,
          y: body.y,
          linkX: body.linkX,
          linkY: body.linkY,
          loopable: body.loopable,
          updateDatetime: "current_timestamp()",
        })
        .where("blockId = :blockID", { blockID: body.blockID })
        .execute();

      await queryRunner.commitTransaction();
      logger.debug(`[runtimeBlockController] [update] update data ok`);
      result.success = true;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(
        `[runtimeBlockController] [update] update data error ${err.message}`
      );
      result.success = false;
      result.message = err.message;
    } finally {
      await queryRunner.release();
      logger.info(`[runtimeBlockController] [update] update data done`);
    }
    return result;
  }

  @Security("passport-cookie")
  @Delete("{blockID}")
  public async delete(@Path() blockID: string): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlock,
      "registerPlugin",
      queryRunner
    );
    await queryRunner.startTransaction();
    try {
      logger.debug(`[runtimeBlockController] [delete] delete data: ${blockID}`);

      queryBuilder
        .delete()
        .from(ChatBlock)
        .where("blockId = :blockID", { blockID })
        .execute();

      await queryRunner.commitTransaction();
      logger.debug(`[runtimeBlockController] [delete] delete data ok`);
      result.success = true;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(
        `[runtimeBlockController] [delete] delete data error ${err.message}`
      );
      result.success = false;
      result.message = err.message;
    } finally {
      await queryRunner.release();
      logger.info(`[runtimeBlockController] [delete] delete data done`);
    }
    return result;
  }
}
