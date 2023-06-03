const express = require('express');
const router = express.Router();

const {
	validateSignupData,
	validateLoginData,
} = require('./users.validation');
const { checkValidation } = require('../middlewares/check-validation')
const { signup, login } = require('./users.controllers');

router.post('/signup', validateSignupData, checkValidation, signup);
router.post('/login', validateLoginData, checkValidation, login);

module.exports = router;
