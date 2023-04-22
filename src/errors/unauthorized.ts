import { HttpError } from './http-error.js';

class Unauthorized extends HttpError {
  constructor(message) {
    super(message, 401);
  }
}

export { Unauthorized };
