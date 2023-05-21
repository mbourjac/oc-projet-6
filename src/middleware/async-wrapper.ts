import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncWrapper = (asyncFunction: AsyncFunction): AsyncFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await asyncFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
