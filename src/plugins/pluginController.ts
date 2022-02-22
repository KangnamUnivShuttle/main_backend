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
    Security
  } from "tsoa";
import { BasicResponseModel } from "../models/response.model";

  @Tags("Plugin")
  @Route("plugin")
  export class PluginController extends Controller {

    @Security('passport-cookie')
    @Get()
    public async getInfo(
        @Query() pid?: number
    ): Promise<BasicResponseModel> {
      return {} as BasicResponseModel;
    }

    @Security('passport-cookie')
    @Post()
    public async registerPlugin(): Promise<BasicResponseModel> {
      return {} as BasicResponseModel;
    }

    @Security('passport-cookie')
    @Put()
    public async modifyPlugin(): Promise<BasicResponseModel> {
      return {} as BasicResponseModel;
    }

    @Security('passport-cookie')
    @Delete("{pid}")
    public async deletePlugin(
        @Path() pid: number
    ): Promise<BasicResponseModel> {
      return {} as BasicResponseModel;
    }
}