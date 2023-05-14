/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  namespace Express {
    export interface Request {
      locals: any;
    }
  }
}

export {};
