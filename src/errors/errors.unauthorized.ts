import { HttpError } from './errors.http-error.js';

export class Unauthorized extends HttpError {
  static statusCode = 401;

  constructor(message: string) {
    super(message, Unauthorized.statusCode);
  }
}
