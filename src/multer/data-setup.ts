import { RequestHandler } from 'express';
import {
  IProvideFileData,
  ISetupSauceData,
  IValidateSauce,
} from '../sauces/sauces.types';
import { ITypeRequestBodyAndLocals } from '../request/request.types';

export const dataSetup: RequestHandler = (
  req: ITypeRequestBodyAndLocals<ISetupSauceData, IProvideFileData>,
  res,
  next
): void => {
  if (req.file && req.body.sauce) {
    const sauce: IValidateSauce = JSON.parse(req.body.sauce);

    req.body = { ...req.body, ...sauce };
    req.locals.filePath = req.file.path;
  }

  next();
};
