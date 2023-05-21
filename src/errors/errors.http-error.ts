import { HttpErrorResponse } from './errors.types';

export class HttpError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = this.constructor.name;
  }

  toJSON(): HttpErrorResponse {
    return {
      name: this.name,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
