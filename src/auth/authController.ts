import {
    Controller,
    Get,
    Post,
    Body,
    Security,
    Route,
    Request
  } from "tsoa";
import { BasicResponseModel } from "../models/response.model";
import passport from 'passport';
import express, { Response as ExResponse, Request as ExRequest } from "express";
import logger from '../logger';

@Route("auth")
export class AuthController extends Controller {

    passportAuth() {
        console.log('[AuthController] [passportAuth] auth?')
        return new Promise<any>(resolve => {
            passport.authenticate('local', (err, user, info) => {
                resolve({err, user, info});
            });
        })
    }

    expressAuth(expReq: ExRequest, email: string) {
        return new Promise<any>((resolve) => {
            expReq.login({email}, (err) => {
                if (err) {
                    logger.error(`[AuthController] [expressAuth] Login failed: ${err}`)
                }
                resolve({err, email})
            })
        })
    }

    @Security('passport-cookie')
    @Get()
    public async sessionTest(
            @Request() expReq: ExRequest
        ): Promise<string> {
        return `Hi, ${expReq.user}`;
    }

    @Post()
    public async login(
        @Request() expReq: ExRequest,
        @Body() requestBody: {email: string, passwd: string}
    ): Promise<BasicResponseModel> {
        logger.debug(`[AuthController] [expressAuth] Req login: ${JSON.stringify(requestBody)}`)
        const {err, email} = await this.expressAuth(expReq, requestBody.email);
        if (err || !email) {
            logger.warn(`[AuthController] [expressAuth] Req login failed. Error or email undefined.`)
            return {
                success: false
            } as BasicResponseModel;
        } else {
            logger.info(`[AuthController] [expressAuth] Req login success`);
            return {
                success: true
            } as BasicResponseModel;
        }
    }
}