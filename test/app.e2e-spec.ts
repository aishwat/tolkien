import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from '../src/app.service';
import { TokenStatus } from "../src/types";

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appService: AppService;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AppService],
    }).compile();
    appService = moduleFixture.get<AppService>(AppService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Ok!');
  });

  it('/ (generate)', async () => {
    const resp = await request(app.getHttpServer()).post('/generate/10');
    expect(resp.status).toEqual(201);
    expect(resp.body.tokens.length).toEqual(10);
  });
  it('/ (redeem)', async () => {
    jest.spyOn(appService, 'redeem').mockImplementation(async () => 'OK');
    const resp = await request(app.getHttpServer()).put('/redeem/abc');
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({ result: 'OK' });
  });
  it('/ (check)', async () => {
    jest.spyOn(appService, 'check').mockImplementation(async () => TokenStatus[TokenStatus.Available]);
    const resp = await request(app.getHttpServer()).get('/check/abc');
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({ status: TokenStatus[TokenStatus.Available] });
  });
});
