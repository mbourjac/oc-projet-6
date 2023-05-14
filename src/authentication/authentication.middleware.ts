import { RequestHandler } from 'express';
import { AuthenticationService } from './authentication.service.js';
import { authenticationDependencies } from './authentication.dependencies.js';
import { ITypeRequestLocals } from '../request/request.types.js';
import { IAuthenticateUser } from './authentication.types.js';

export const authenticateUser: RequestHandler = (
  req: ITypeRequestLocals<Partial<IAuthenticateUser>>,
  res,
  next
): void => {
  try {
    const authHeader = req.headers.authorization;
    const authenticationService = AuthenticationService.getInstance(
      authenticationDependencies
    );
    const userId = authenticationService.authenticateUser(authHeader);

    req.locals = { userId };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
