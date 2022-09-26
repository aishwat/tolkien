import { BadRequestException, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { nanoid } from 'nanoid';
import { GenerateResp, TOKENSET, TokenStatus } from './types';
import { AppBaseException } from './app-base-exception';

@Injectable()
export class AppService {
  private readonly redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }
  async set() {
    return await this.redis.set('key', 'value', 'EX', 1000);
  }

  health(): string {
    return 'Ok!';
  }
  async generate(num): Promise<GenerateResp> {
    try {
      if (num > 100) {
        throw new Error('number > 100 not supported');
      }
      let arr = [];
      while (arr.length < num) {
        const id = await nanoid(10);
        if (await this.redis.exists(id)) {
          continue;
        }
        arr.push(id);
        this.redis.set(
          id,
          TokenStatus[TokenStatus.Available],
          'EX',
          60 * 60 * 24 * 10,
        );
      }
      return { created: new Date().toISOString(), tokens: arr };
    } catch (err) {
      throw new AppBaseException(err.message);
    }
  }

  async check(token): Promise<string> {
    const status = await this.redis.get(token);
    if (status) {
      return status;
    }
    return TokenStatus[TokenStatus.Expired];
  }

  async redeem(token): Promise<string> {
    try {
      await this.redis.watch(token)
      const status = await this.redis.get(token);
      if (status === TokenStatus[TokenStatus.Available]) {
        // todo : Optimistic locking via watch, exec // edge case when 2 requests are racing to redeem same token
        // check : does it matter if we re-redeem a redeemed token?
        await this.redis.multi().set(token, TokenStatus[TokenStatus.Redeemed], 'KEEPTTL').exec();
        return 'OK';
      } else if (status === TokenStatus[TokenStatus.Redeemed]) {
        return status;
      }
      return TokenStatus[TokenStatus.Expired];
    } catch (err) {
      throw err;
    }
    finally {
      await this.redis.unwatch(token)
    }
  }
}
