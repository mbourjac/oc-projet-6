import express from 'express';
import { multerSetup, fileCheck, dataCheck, dataSetup } from '../multer';
import { validateSauceData, validateLikeData } from './sauces.validation';
import { validationCheck } from '../middleware/validation-check';
import { saucesController } from './sauces.controller';
import { authorizeUser } from './sauces.authorization';
import { findSauceOrThrow } from './sauces.finder';

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
saucesRouter.get('/:id', findSauceOrThrow, saucesController.getSauce);
saucesRouter.put(
  '/:id',
  multerSetup,
  dataCheck,
  dataSetup,
  validateSauceData,
  validationCheck,
  findSauceOrThrow,
  authorizeUser,
  saucesController.updateSauce
);
saucesRouter.delete(
  '/:id',
  findSauceOrThrow,
  authorizeUser,
  saucesController.deleteSauce
);
saucesRouter.post(
  '/:id/like',
  validateLikeData,
  validationCheck,
  findSauceOrThrow,
  saucesController.updateLikeStatus
);
