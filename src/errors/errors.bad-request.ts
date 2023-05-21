import { HttpError } from './errors.http-error';

export class BadRequest extends HttpError {
  static statusCode = 400;

  constructor(message: string) {
    super(message, BadRequest.statusCode);
  }
}
