import { RequestHandler } from 'express';
import { ISetupSauceData, IValidateSauce } from '../sauces/sauces.types.js';
import { ITypeRequestBody } from '../request/request.types.js';

export const dataSetup: RequestHandler = (
  req: ITypeRequestBody<ISetupSauceData>,
  res,
  next
): void => {
  if (req.file && req.body.sauce) {
    const sauce: IValidateSauce = JSON.parse(req.body.sauce);

    Object.assign(req.body, sauce);
  }

  next();
};
