import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

export const validationCheck: RequestHandler = (req, res, next): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  next();
};
