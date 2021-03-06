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
import { ChatBlockLink } from "../orm/entities/ChatBlockLink";
import { getConnection } from "typeorm";
import logger from "../logger";
import { RuntimeBlockLinkModel } from "../models/runtime.model";
import { pagingQuerySelection, pagingUnionQuery } from "../lib/queryUtils";

@Tags("RuntimeLink")
@Route("runtimeLink")
export class RuntimeLinkController extends Controller {
  @Security("passport-cookie")
  @Get()
  public async getInfo(@Query() blockID: string): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();

    const queryBuilder = await connection.createQueryBuilder(
      ChatBlockLink,
      "_ChatBlockLink",
      queryRunner
    );
    const countQueryBuilder = await connection.createQueryBuilder(
      ChatBlockLink,
      "_ChatBlockLink",
      queryRunner
    );
    try {
      const { countCols, dataCols } = pagingQuerySelection("_ChatBlockLink", [
        "blockLinkId",
        "blockId",
        "nextBlockId",
        "messageText",
        "action",
        "label",
        "webLinkUrl",
        "enabled",
        "orderNum",
        "isMlCategory",
        "registerDatetime",
        "updateDatetime",
      ]);
      const countQuery = countQueryBuilder
        .select(countCols)
        // .from(ChatBlockLink, "_ChatBlockLink")
        .where(`_ChatBlockLink.blockId = ?`)
        // .orderBy("_ChatBlockLink.orderNum", "ASC")
        .getQuery();

      // https://jojoldu.tistory.com/579
      const dataQuery = queryBuilder
        .select(dataCols)
        // .from(ChatBlockLink, "_ChatBlockLink")

        // https://github.com/typeorm/typeorm/issues/3103#issuecomment-445497288
        .where("_ChatBlockLink.blockId = ?")
        // .orderBy("_ChatBlockLink.orderNum", "ASC")
        .getQuery();

      result.success = true;
      result.data = await pagingUnionQuery(
        countQuery,
        dataQuery,
        [blockID, blockID],
        "order by `orderNum` ASC"
      );
    } catch (err: any) {
      logger.error(
        `[runtimeLinkController] [getInfo] failed to load chat image data ${err.message}`
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
    @Body() body: RuntimeBlockLinkModel
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlockLink,
      "registerPlugin",
      queryRunner
    );
    await queryRunner.startTransaction();
    try {
      logger.debug(
        `[runtimeLinkController] [insert] insert data: ${JSON.stringify(body)}`
      );

      queryBuilder
        .insert()
        .into(ChatBlockLink)
        .values([
          {
            blockId: body.blockID,
            nextBlockId: body.nextBlockID,
            messageText: body.messageText,
            action: body.action,
            label: body.label,
            webLinkUrl: body.webLinkUrl,
            enabled: body.enabled,
            orderNum: body.order_num,
            isMlCategory: body.is_ml_category,
          },
        ])
        .execute();

      await queryRunner.commitTransaction();
      logger.debug(`[runtimeLinkController] [insert] insert data ok`);
      result.success = true;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(
        `[runtimeLinkController] [insert] insert data error ${err.message}`
      );
      result.success = false;
      result.message = err.message;
    } finally {
      await queryRunner.release();
      logger.info(`[runtimeLinkController] [insert] insert data done`);
    }
    return result;
  }

  @Security("passport-cookie")
  @Put()
  public async update(
    @Body() body: RuntimeBlockLinkModel
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlockLink,
      "registerPlugin",
      queryRunner
    );
    await queryRunner.startTransaction();
    try {
      logger.debug(
        `[runtimeLinkController] [update] update data: ${JSON.stringify(body)}`
      );

      queryBuilder
        .update(ChatBlockLink)
        .set({
          nextBlockId: body.nextBlockID,
          messageText: body.messageText,
          action: body.action,
          label: body.label,
          webLinkUrl: body.webLinkUrl,
          enabled: body.enabled,
          orderNum: body.order_num,
          isMlCategory: body.is_ml_category,
          updateDatetime: "current_timestamp()",
        })
        .where("blockLinkId = :blockLinkID", { blockLinkID: body.blockLinkID })
        .execute();

      await queryRunner.commitTransaction();
      logger.debug(`[runtimeLinkController] [update] update data ok`);
      result.success = true;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(
        `[runtimeLinkController] [update] update data error ${err.message}`
      );
      result.success = false;
      result.message = err.message;
    } finally {
      await queryRunner.release();
      logger.info(`[runtimeLinkController] [update] update data done`);
    }
    return result;
  }

  @Security("passport-cookie")
  @Delete("{blockLinkID}")
  public async delete(
    @Path() blockLinkID: number
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      ChatBlockLink,
      "registerPlugin",
      queryRunner
    );
    await queryRunner.startTransaction();
    try {
      logger.debug(
        `[runtimeLinkController] [delete] delete data: ${blockLinkID}`
      );

      queryBuilder
        .delete()
        .from(ChatBlockLink)
        .where("blockLinkId = :blockLinkID", { blockLinkID })
        .execute();

      await queryRunner.commitTransaction();
      logger.debug(`[runtimeLinkController] [delete] delete data ok`);
      result.success = true;
    } catch (err: any) {
      await queryRunner.rollbackTransaction();
      logger.error(
        `[runtimeLinkController] [delete] delete data error ${err.message}`
      );
      result.success = false;
      result.message = err.message;
    } finally {
      await queryRunner.release();
      logger.info(`[runtimeLinkController] [delete] delete data done`);
    }
    return result;
  }
}
