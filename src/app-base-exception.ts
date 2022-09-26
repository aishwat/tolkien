import { HttpException, HttpStatus } from '@nestjs/common';

export class AppBaseException extends HttpException {
  meta;

  constructor(message, status = HttpStatus.BAD_REQUEST, meta: object = null) {
    super(message, status);
    this.meta = meta;
  }
}
