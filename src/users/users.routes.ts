import express from 'express';
import { validateSignupData, validateLoginData } from './users.validation';
import { validationCheck } from '../middleware/validation-check';
import { usersController } from './users.controller';

export const authRouter = express.Router();

authRouter.post(
  '/signup',
  validateSignupData,
  validationCheck,
  usersController.signup
);

authRouter.post(
  '/login',
  validateLoginData,
  validationCheck,
  usersController.login
);
