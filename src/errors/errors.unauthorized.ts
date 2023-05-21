import { HttpError } from './errors.http-error';

export class Unauthorized extends HttpError {
  static statusCode = 401;

  constructor(message: string) {
    super(message, Unauthorized.statusCode);
  }
}
