import {
  Controller,
  Get,
  Post,
  Body,
  Security,
  Route,
  Request,
  Tags,
  Delete,
  Put,
  Query,
  Path,
} from "tsoa";
import { BasicResponseModel } from "../models/response.model";
import passport from "passport";
import express, { Response as ExResponse, Request as ExRequest } from "express";
import logger from "../logger";
import { AdminUser } from "../orm/entities/AdminUser";
import { getConnection, getManager } from "typeorm";
import { ChatBlock } from "../orm/entities/ChatBlock";
import { pagingQuerySelection } from "../lib/queryUtils";

@Tags("Account")
@Route("account")
export class AccountController extends Controller {
  @Security("passport-cookie")
  @Get()
  public async getInfo(
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<BasicResponseModel> {
    const result = {
      success: false,
    } as BasicResponseModel;

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      AdminUser,
      "registerPlugin",
      queryRunner
    );

    const countQueryBuilder = await connection.createQueryBuilder(
      AdminUser,
      "countQueryBuilder",
      queryRunner
    );
    try {
      // https://jojoldu.tistory.com/579
      // https://kmseop.tistory.com/186

      const { countCols, dataCols } = pagingQuerySelection("_AdminUser", [
        "uid",
        "email",
        "enabled",
        "memo",
        "deleteable",
        "registerDatetime",
        "updateDatetime",
        "lastLoginDatetime",
      ]);
      let countQuery = countQueryBuilder
        .select(countCols)
        .from(AdminUser, "_AdminUser")
        .getQuery();

      let query = queryBuilder
        .select(dataCols)
        .from(AdminUser, "_AdminUser")
        .orderBy("_AdminUser.uid", "ASC")
        .limit(limit)
        .offset((page - 1) * limit)
        .getQuery();
      //   console.log("query", query);

      // https://github.com/typeorm/typeorm/issues/2992#issuecomment-876965843
      const entityManager = getManager();

      // https://github.com/typeorm/typeorm/issues/3103#issuecomment-445497288
      // if (blockID) {
      //     query = query.where("_ChatBlock.blockId = :blockID", { blockID })
      // }
      // if (name) {
      //     query = query.where("_ChatBlock.name like :name", {name: `%${name}%`})
      // }

      //   console.log(`${countQuery} UNION SELECT * FROM (${query})`);
      const runtimeList = await entityManager.query(
        `${countQuery} UNION SELECT * FROM (${query}) AS Data`
      );
      result.success = true;
      result.data = runtimeList;
    } catch (err: any) {
      logger.error(
        `[AccountController] [getInfo] failed to load account data ${err.message}`
      );
      result.message = err.message;
    } finally {
      queryRunner.release();
    }
    return result;
  }

  @Security("passport-cookie")
  @Post()
  public async register(): Promise<BasicResponseModel> {
    return {} as BasicResponseModel;
  }

  @Security("passport-cookie")
  @Put()
  public async modify(): Promise<BasicResponseModel> {
    return {} as BasicResponseModel;
  }

  @Security("passport-cookie")
  @Delete("{uid}")
  public async deleteAccount(@Path() uid: number): Promise<BasicResponseModel> {
    return {} as BasicResponseModel;
  }
}
