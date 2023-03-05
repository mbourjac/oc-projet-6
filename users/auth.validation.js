const { body } = require('express-validator');

const validateSignup = [
	body('email')
		.exists()
		.withMessage('Email field is required')
		.bail()
		.isString()
		.withMessage('This value must be a string')
		.bail()
		.isEmail()
		.withMessage('Please provide a valid email')
		.bail()
		.normalizeEmail(),
	body('password')
		.exists()
		.withMessage('Password field is required')
		.bail()
		.isString()
		.withMessage('This value must be a string')
		.bail()
		.isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
		.withMessage(
			'Password must contain at least 8 characters, a lowercase letter, an uppercase letter, a number and a symbol'
		),
];

const validateLogin = [
	body('email')
		.exists()
		.withMessage('Email field is required')
		.bail()
		.isString()
		.withMessage('This value must be a string')
		.bail()
		.normalizeEmail(),
	body('password')
		.exists()
		.withMessage('Password field is required')
		.bail()
		.isString()
		.withMessage('This value must be a string'),
];

module.exports = {
	validateSignup,
	validateLogin,
};
