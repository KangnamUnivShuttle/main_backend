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
    Path
  } from "tsoa";
import { BasicResponseModel } from "../models/response.model";
import passport from 'passport';
import express, { Response as ExResponse, Request as ExRequest } from "express";
import logger from '../logger';

@Tags("Account")
@Route("account")
export class AccountController extends Controller {

    @Security('passport-cookie')
    @Get()
    public async getInfo(
        @Query() page: number = 1,
        @Query() limit: number = 10,
        @Query() uid?: number
    ): Promise<BasicResponseModel> {
        return {} as BasicResponseModel;
    }

    @Security('passport-cookie')
    @Post()
    public async register(): Promise<BasicResponseModel> {
        return {} as BasicResponseModel;
    }

    @Security('passport-cookie')
    @Put()
    public async modify(): Promise<BasicResponseModel> {
        return {} as BasicResponseModel;
    }

    @Security('passport-cookie')
    @Delete('{uid}')
    public async deleteAccount(
        @Path() uid: number
    ): Promise<BasicResponseModel> {
        return {} as BasicResponseModel;
    }
}