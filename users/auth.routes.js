const express = require('express');
const router = express.Router();

const {
	validateSignupData,
	validateLoginData,
	validationCheck,
} = require('./auth.validation');
const { signup, login } = require('./auth.controllers');

router.post('/signup', validateSignupData, validationCheck, signup);
router.post('/login', validateLoginData, validationCheck, login);

module.exports = router;
