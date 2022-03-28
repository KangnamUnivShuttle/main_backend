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
    Response
} from "tsoa";
import { BasicResponseModel } from "../models/response.model";

@Tags("RuntimeBlock")
@Route("runtimeBlock")
export class RuntimeBlockController extends Controller {

    @Security('passport-cookie')
    @Get()
    public async getInfo(
        @Query() page: number = 1,
        @Query() limit: number = 10,
        @Query() blockID?: string,
    ): Promise<BasicResponseModel> {
        return {} as BasicResponseModel;
    }

    @Security('passport-cookie')
    @Post()
    public async insert(): Promise<BasicResponseModel> {
        return {} as BasicResponseModel
    }

    @Security('passport-cookie')
    @Put()
    public async update(): Promise<BasicResponseModel> {
        return {} as BasicResponseModel
    }

    @Security('passport-cookie')
    @Delete('{blockID}')
    public async delete(@Path() blockID: string): Promise<BasicResponseModel> {
        return {} as BasicResponseModel
    }
}