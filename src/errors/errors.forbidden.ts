import { HttpError } from './errors.http-error';

export class Forbidden extends HttpError {
  static statusCode = 403;

  constructor(message: string) {
    super(message, Forbidden.statusCode);
  }
}
