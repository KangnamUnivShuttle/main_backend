import {
    Controller,
    Get,
    Route,
    Tags
  } from "tsoa";

  @Tags("Hello world")
  @Route("hello")
  export class HelloController extends Controller {
    @Get()
    public async hello(): Promise<string> {
      return 'hello world!';
    }
}