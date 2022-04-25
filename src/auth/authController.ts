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
} from "tsoa";
import { BasicResponseModel } from "../models/response.model";
import passport from "passport";
import express, { Response as ExResponse, Request as ExRequest } from "express";
import logger from "../logger";
import { getConnection } from "typeorm";
import { AdminUser } from "../orm/entities/AdminUser";
import { pagingQuerySelection } from "../lib/queryUtils";
import { createHash } from "crypto";

@Tags("Auth")
@Route("auth")
export class AuthController extends Controller {
  passportAuth() {
    console.log("[AuthController] [passportAuth] auth?");
    return new Promise<any>((resolve) => {
      passport.authenticate("local", (err, user, info) => {
        resolve({ err, user, info });
      });
    });
  }

  expressAuth(expReq: ExRequest, email: string) {
    return new Promise<any>((resolve) => {
      expReq.login({ email }, (err) => {
        if (err) {
          logger.error(`[AuthController] [expressAuth] Login failed: ${err}`);
        }
        resolve({ err, email });
      });
    });
  }

  @Security("passport-cookie")
  @Get()
  public async sessionTest(@Request() expReq: ExRequest): Promise<string> {
    return `Hi, ${expReq.user}`;
  }

  async isUserValid(email: string, passwd: string) {
    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner();
    const queryBuilder = await connection.createQueryBuilder(
      AdminUser,
      "_AdminUser",
      queryRunner
    );

    const { countCols, dataCols } = pagingQuerySelection("_AdminUser", [
      "uid",
      "email",
      "passwd",
    ]);

    return queryBuilder
      .select(dataCols)
      .where("_AdminUser.email = :email && _AdminUser.passwd = :passwd", {
        email,
        passwd: createHash("sha256").update(passwd).digest("hex"),
      })
      .getCount();
  }

  @Post()
  public async login(
    @Request() expReq: ExRequest,
    @Body() requestBody: { email: string; passwd: string }
  ): Promise<BasicResponseModel> {
    logger.debug(
      `[AuthController] [expressAuth] Req login: ${JSON.stringify(requestBody)}`
    );
    const valid = await this.isUserValid(requestBody.email, requestBody.passwd);
    if (valid !== 1) {
      logger.error(
        `[AuthController] [expressAuth] email or password not matched.`
      );
      return {
        success: false,
        message: "Email or password not matched",
      } as BasicResponseModel;
    }
    const { err, email } = await this.expressAuth(expReq, requestBody.email);
    if (err || !email) {
      logger.warn(
        `[AuthController] [expressAuth] Req login failed. Error or email undefined.`
      );
      return {
        success: false,
      } as BasicResponseModel;
    } else {
      logger.info(`[AuthController] [expressAuth] Req login success`);
      return {
        success: true,
      } as BasicResponseModel;
    }
  }

  @Security("passport-cookie")
  @Delete()
  public async logout(
    @Request() expReq: ExRequest
  ): Promise<BasicResponseModel> {
    try {
      logger.debug(`[AuthController] [logout] bye user: ${expReq.user}`);
      expReq.logout();
      return {
        success: true,
      } as BasicResponseModel;
    } catch (err: any) {
      logger.error(`[AuthController] [logout] failed, user: ${expReq.user}`);
      return {
        success: false,
        message: err.message || "Unknown error!",
      } as BasicResponseModel;
    }
  }
}
