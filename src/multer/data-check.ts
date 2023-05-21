import { RequestHandler } from 'express';
import { BadRequest } from '../errors';
import { ITypeRequestBody } from '../request/request.types';
import { IParseSauce } from '../sauces/sauces.types';

export const dataCheck: RequestHandler = (
  req: ITypeRequestBody<IParseSauce>,
  res,
  next
): void => {
  if (req.file && !req.body.sauce) {
    throw new BadRequest('Please provide required information');
  }

  next();
};
