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

@Tags("RuntimeLink")
@Route("runtimeLink")
export class RuntimeLinkController extends Controller {

    @Security('passport-cookie')
    @Get()
    public async getInfo(
        @Query() blockLinkID?: number,
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
    @Delete('{blockLinkID}')
    public async delete(@Path() blockLinkID: number): Promise<BasicResponseModel> {
        return {} as BasicResponseModel
    }
}