import express from 'express';
import { validateSignupData, validateLoginData } from './users.validation.js';
import { validationCheck } from '../middleware/validation-check.js';
import { usersController } from './users.controller.js';

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
