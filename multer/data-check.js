const { BadRequest } = require('../errors');

const dataCheck = (req, res, next) => {
	if (req.file && !req.body.sauce) {
		throw new BadRequest('Please provide required information');
	}

	next();
};

module.exports = dataCheck;
