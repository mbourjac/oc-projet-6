import { HttpError } from './errors.http-error.js';

export class BadRequest extends HttpError {
  static statusCode = 400;

  constructor(message: string) {
    super(message, BadRequest.statusCode);
  }
}
