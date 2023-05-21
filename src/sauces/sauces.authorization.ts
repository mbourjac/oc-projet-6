import { RequestHandler } from 'express';
import { ITypeRequestLocals } from '../request/request.types';
import { IAuthenticateUser } from '../authn/authn.types';
import { IProvideSauceData } from './sauces.types';
import { Forbidden } from '../errors/errors.forbidden';

export const authorizeUser: RequestHandler = (
  req: ITypeRequestLocals<IAuthenticateUser & IProvideSauceData>,
  res,
  next
): void => {
  const { userId, sauce } = req.locals;
  const operation = req.method === 'PUT' ? 'update' : 'delete';

  if (sauce.userId !== userId) {
    throw new Forbidden(`You are not authorized to ${operation} this sauce`);
  }

  next();
};
