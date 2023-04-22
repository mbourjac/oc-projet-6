import { HttpError } from './http-error.js';

class BadRequest extends HttpError {
  constructor(message) {
    super(message, 400);
  }
}

export { BadRequest };
