import { RequestHandler } from 'express';
import { BadRequest } from '../errors';
import { ITypeRequestLocals } from '../request/request.types';
import { IProvideFileData } from '../sauces/sauces.types';

export const fileCheck: RequestHandler = (
  req: ITypeRequestLocals<Partial<IProvideFileData>>,
  res,
  next
): void => {
  if (!req.file) {
    throw new BadRequest('Please provide an image file');
  }

  next();
};
