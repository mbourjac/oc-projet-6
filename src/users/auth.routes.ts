import express from 'express';
import {
  validateSignupData,
  validateLoginData,
  validationCheck,
} from './auth.validation.js';
import { signup, login } from './auth.controllers.js';

const router = express.Router();

router.post('/signup', validateSignupData, validationCheck, signup);
router.post('/login', validateLoginData, validationCheck, login);

export { router };
