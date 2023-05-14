import { Request } from 'express';

export interface ITypeRequestBody<T> extends Request {
  body: T;
}

export interface ITypeRequestLocals<T> extends Request {
  locals: T;
}

export interface ITypeRequestBodyAndLocals<T, U> extends Request {
  body: T;
  locals: U;
}
