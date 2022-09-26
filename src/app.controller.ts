import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GenerateResp, TokenStatus } from './types';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async health(): Promise<string> {
    this.appService.set();
    return this.appService.health();
  }

  @Post('/generate/:num')
  async generate(@Param('num') num: number): Promise<GenerateResp> {
    return this.appService.generate(num);
  }

  @Get('/check/:token')
  async check(@Param('token') token: string): Promise<{ status: string }> {
    const status = await this.appService.check(token);
    return { status };
  }

  @Put('/redeem/:token')
  async redeem(@Param('token') token: string, @Res() res: Response) {
    const status = await this.appService.redeem(token);
    if (status === 'OK') {
      res.status(HttpStatus.OK).json({ result: status });
    } else {
      res.status(HttpStatus.GONE).json({ result: status });
    }
    return
  }
}
