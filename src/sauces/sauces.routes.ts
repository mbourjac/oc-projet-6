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

const router = express.Router();

router.get('/', getAllSauces);
router.post(
  '/',
  multerSetup,
  fileCheck,
  dataCheck,
  dataSetup,
  validateSauceData,
  validationCheck,
  createSauce
);
router.get('/:id', findSauceOrThrow, getSauce);
router.put(
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
router.delete('/:id', findSauceOrThrow, canManageSauce, deleteSauce);
router.post(
  '/:id/like',
  validateLikeData,
  validationCheck,
  findSauceOrThrow,
  updateLikeStatus
);

export { router };
