const { BadRequest } = require('../errors');

const fileCheck = (req, res, next) => {
	if (!req.file) {
		throw new BadRequest('Please provide an image file');
	}

	next();
};

module.exports = fileCheck;
