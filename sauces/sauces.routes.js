const express = require('express');
const router = express.Router();

const { multerSetup, fileCheck, dataCheck, dataSetup } = require('../multer');
const { findSauceOrThrow, authorizeUser } = require('./sauces.middleware');
const {
	validateSauceData,
	validateLikeData,
	validationCheck,
} = require('./sauces.validation');
const {
	getAllSauces,
	createSauce,
	getSauce,
	updateSauce,
	deleteSauce,
	updateLikeStatus,
} = require('./sauces.controllers');

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
	authorizeUser,
	updateSauce
);
router.delete('/:id', findSauceOrThrow, authorizeUser, deleteSauce);
router.post(
	'/:id/like',
	validateLikeData,
	validationCheck,
	findSauceOrThrow,
	updateLikeStatus
);

module.exports = router;
