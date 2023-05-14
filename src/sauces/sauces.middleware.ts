import { RequestHandler } from 'express';
import { SaucesService } from './sauces.service.js';
import { sauceDependencies } from './sauces.dependencies.js';
import { IProvideSauceData } from './sauces.types.js';
import { ITypeRequestLocals } from '../request/request.types.js';
import { IAuthenticateUser } from '../authentication/authentication.types.js';
import { Forbidden } from '../errors';

class SaucesMiddleware {
  constructor(private readonly saucesService: SaucesService) {}

  findSauceOrThrow: RequestHandler = async (
    req: ITypeRequestLocals<Partial<IProvideSauceData>>,
    res,
    next
  ): Promise<void> => {
    try {
      const sauceId = req.params.id;
      const sauce = await this.saucesService.findSauceOrThrow(sauceId);

      req.locals.sauce = sauce;

      next();
    } catch (error) {
      next(error);
    }
  };

  canManageSauce: RequestHandler = (
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
}

export const saucesMiddleware = new SaucesMiddleware(
  SaucesService.getInstance(sauceDependencies)
);
