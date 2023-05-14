import { RequestHandler } from 'express';
import { SaucesService } from './sauces.service.js';
import { sauceDependencies } from './sauces.dependencies.js';
import { IProvideSauceData } from './sauces.types.js';
import { ITypeRequestLocals } from '../request/request.types.js';

export const findSauceOrThrow: RequestHandler = async (
  req: ITypeRequestLocals<Partial<IProvideSauceData>>,
  res,
  next
): Promise<void> => {
  try {
    const sauceId = req.params.id;
    const saucesService = SaucesService.getInstance(sauceDependencies);
    const sauce = await saucesService.findSauceOrThrow(sauceId);

    req.locals.sauce = sauce;

    next();
  } catch (error) {
    next(error);
  }
};
