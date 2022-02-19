import {
    Controller,
    Get,
    Post,
    Body,
    Security,
    Route,
  } from "tsoa";
import { BasicResponseModel } from "../models/response.model";
import passport from 'passport';

@Route("auth")
export class AuthController extends Controller {

    passportAuth() {
        return new Promise<any>(resolve => {
            passport.authenticate('local', (err, user, info) => {
                resolve({err, user, info});
            });
        })
    }

    @Security('passport-cookie')
    @Get()
    public async test(): Promise<string> {
      return 'hello world!';
    }

    @Post()
    public async login(
        @Body() requestBody: {username: string, password: string}
    ): Promise<BasicResponseModel> {
        const {err, user, info} = await this.passportAuth();
        console.log('[AuthController] [login]', 'err', err, 'user', user, 'info', info)
        if (err || !user) {
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