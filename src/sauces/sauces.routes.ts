import express from 'express';
import { multerSetup, fileCheck, dataCheck, dataSetup } from '../multer';
import { validateSauceData, validateLikeData } from './sauces.validation.js';
import { validationCheck } from '../middleware/validation-check.js';
import { saucesController } from './sauces.controller.js';
import { saucesMiddleware } from './sauces.middleware.js';

export const saucesRouter = express.Router();

saucesRouter.get('/', saucesController.getAllSauces);
saucesRouter.post(
  '/',
  multerSetup,
  fileCheck,
  dataCheck,
  dataSetup,
  validateSauceData,
  validationCheck,
  saucesController.createSauce
);
saucesRouter.get(
  '/:id',
  saucesMiddleware.findSauceOrThrow,
  saucesController.getSauce
);
saucesRouter.put(
  '/:id',
  multerSetup,
  dataCheck,
  dataSetup,
  validateSauceData,
  validationCheck,
  saucesMiddleware.findSauceOrThrow,
  saucesMiddleware.authorizeUser,
  saucesController.updateSauce
);
saucesRouter.delete(
  '/:id',
  saucesMiddleware.findSauceOrThrow,
  saucesMiddleware.authorizeUser,
  saucesController.deleteSauce
);
saucesRouter.post(
  '/:id/like',
  validateLikeData,
  validationCheck,
  saucesMiddleware.findSauceOrThrow,
  saucesController.updateLikeStatus
);
