import { RequestHandler } from 'express';
import { AuthnService } from './authn.service';
import { authnDependencies } from './authn.dependencies';
import { ITypeRequestLocals } from '../request/request.types';
import { IAuthenticateUser } from './authn.types';

export const authenticateUser: RequestHandler = (
  req: ITypeRequestLocals<Partial<IAuthenticateUser>>,
  res,
  next
): void => {
  try {
    const authHeader = req.headers.authorization;
    const authnService = AuthnService.getInstance(authnDependencies);
    const userId = authnService.authenticateUser(authHeader);

    req.locals = { userId };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
