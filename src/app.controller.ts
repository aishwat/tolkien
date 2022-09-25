import { Controller, Get, Param, Post, Put } from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  health(): string {
    return this.appService.health();
  }

  @Post('/generate/:num')
  generate(@Param('num') num: number): GenerateResp {
    return this.appService.generate(num);
  }

  @Get('/check/:token')
  check(@Param('token') token: string): TokenStatus {
    return this.appService.check(token);
  }

  @Put('/redeem/:token')
  redeem(@Param('token') token: string): RedeemStatus {
    return this.appService.redeem(token);
  }
}
