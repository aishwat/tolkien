import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): string {
    return 'Ok!';
  }
  generate(num): GenerateResp {
    return { created: Date.now(), tokens: ['abc', 'def'] };
  }

  check(token): TokenStatus {
    return { status: 'available' };
  }

  redeem(token): RedeemStatus {
    return { result: 'redeemed' };
  }
}
