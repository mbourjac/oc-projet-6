import { HttpError } from './errors.http-error.js';

export class NotFound extends HttpError {
  static statusCode = 404;

  constructor(message: string) {
    super(message, NotFound.statusCode);
  }
}
