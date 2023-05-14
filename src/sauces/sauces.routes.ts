import express from 'express';
import { multerSetup, fileCheck, dataCheck, dataSetup } from '../multer';
import { findSauceOrThrow, canManageSauce } from './sauces.middleware.js';
import {
  validateSauceData,
  validateLikeData,
  validationCheck,
} from './sauces.validation.js';
import {
  getAllSauces,
  createSauce,
  getSauce,
  updateSauce,
  deleteSauce,
  updateLikeStatus,
} from './sauces.controllers.js';

const saucesRouter = express.Router();

saucesRouter.get('/', getAllSauces);
saucesRouter.post(
  '/',
  multerSetup,
  fileCheck,
  dataCheck,
  dataSetup,
  validateSauceData,
  validationCheck,
  createSauce
);
saucesRouter.get('/:id', findSauceOrThrow, getSauce);
saucesRouter.put(
  '/:id',
  multerSetup,
  dataCheck,
  dataSetup,
  validateSauceData,
  validationCheck,
  findSauceOrThrow,
  canManageSauce,
  updateSauce
);
saucesRouter.delete('/:id', findSauceOrThrow, canManageSauce, deleteSauce);
saucesRouter.post(
  '/:id/like',
  validateLikeData,
  validationCheck,
  findSauceOrThrow,
  updateLikeStatus
);

export { saucesRouter };
