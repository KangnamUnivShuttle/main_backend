import {
    Controller,
    Get,
    Route,
  } from "tsoa";

  @Route("hello")
  export class HelloController extends Controller {
    @Get()
    public async hello(): Promise<string> {
      return 'hello world!';
    }
}