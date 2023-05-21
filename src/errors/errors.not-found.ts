import { HttpError } from './errors.http-error';

export class NotFound extends HttpError {
  static statusCode = 404;

  constructor(message: string) {
    super(message, NotFound.statusCode);
  }
}
