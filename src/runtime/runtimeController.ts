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
    Security
  } from "tsoa";
import { BasicResponseModel } from "../models/response.model";

  @Tags("Runtime")
  @Route("runtime")
  export class RuntimeController extends Controller {

    @Security('passport-cookie')
    @Get()
    public async getInfo(
        @Query() rid?: number
    ): Promise<BasicResponseModel> {
        return {

        } as BasicResponseModel;
    }

    @Security('passport-cookie')
    @Post("register")
    public async registerNewRuntime(): Promise<BasicResponseModel> {
        return {

        } as BasicResponseModel;
    }

    @Post("execute/{rid}")
    public async execute(
        @Path() rid: number
    ): Promise<BasicResponseModel> {
        return {

        } as BasicResponseModel;
    }

    @Security('passport-cookie')
    @Put("modify")
    public async modifyRuntime(): Promise<BasicResponseModel> {
        return {

        } as BasicResponseModel;
    }

    @Security('passport-cookie')
    @Delete("{rid}")
    public async deleteRuntime(
        @Path() rid: number
    ): Promise<BasicResponseModel> {
        return {

        } as BasicResponseModel;
    }
}