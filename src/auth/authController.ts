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
                    console.log('[AuthController] [expressAuth]', 'err', err)
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
        console.log('[AuthController] [login]', requestBody)
        const {err, email} = await this.expressAuth(expReq, requestBody.email);
        if (err || !email) {
            return {
                success: false
            } as BasicResponseModel;
        } else {
            return {
                success: true
            } as BasicResponseModel;
        }
    }
}