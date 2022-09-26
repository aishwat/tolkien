import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
@Module({
  imports: [RedisModule.forRoot({
    config: {
      host: 'localhost',
      port: 6379,
      password: ''
    }
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
