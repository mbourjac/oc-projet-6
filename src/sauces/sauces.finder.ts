import { RequestHandler } from 'express';
import { SaucesService } from './sauces.service';
import { sauceDependencies } from './sauces.dependencies';
import { IProvideSauceData } from './sauces.types';
import { ITypeRequestLocals } from '../request/request.types';

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
