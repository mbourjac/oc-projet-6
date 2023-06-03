const express = require('express');
const router = express.Router();

const { multerSetup, fileCheck, dataCheck, dataSetup } = require('../multer');
const { findSauceOrThrow, authorizeUser } = require('./sauces.middlewares');
const {
	validateSauceData,
	validateLikeData,
} = require('./sauces.validation');
const { checkValidation } = require('../middlewares/check-validation')
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
	checkValidation,
	createSauce
);
router.get('/:id', findSauceOrThrow, getSauce);
router.put(
	'/:id',
	multerSetup,
	dataCheck,
	dataSetup,
	validateSauceData,
	checkValidation,
	findSauceOrThrow,
	authorizeUser,
	updateSauce
);
router.delete('/:id', findSauceOrThrow, authorizeUser, deleteSauce);
router.post(
	'/:id/like',
	validateLikeData,
	checkValidation,
	findSauceOrThrow,
	updateLikeStatus
);

module.exports = router;
