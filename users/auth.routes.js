const express = require('express');
const router = express.Router();

const { validateSignup, validateLogin } = require('./auth.validation');
const checkValidation = require('../middleware/check-validation');
const { signup, login } = require('./auth.controllers');

router.post('/signup', validateSignup, checkValidation, signup);
router.post('/login', validateLogin, checkValidation, login);

module.exports = router;
