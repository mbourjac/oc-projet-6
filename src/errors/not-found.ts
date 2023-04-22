import { HttpError } from './http-error.js';

class NotFound extends HttpError {
  constructor(message) {
    super(message, 404);
  }
}

export { NotFound };
