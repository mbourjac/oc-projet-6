const { BadRequest } = require('../errors');

const checkFile = (req, res, next) => {
	if (!req.file) {
		throw new BadRequest('Please provide an image file');
	}

	next();
};

const checkData = (req, res, next) => {
	if (req.file && !req.body.sauce) {
		throw new BadRequest('Please provide required information');
	}

	next();
};

const setupData = (req, res, next) => {
	if (req.file && req.body.sauce) {
		const sauce = JSON.parse(req.body.sauce);

		req.body = {...req.body, ...sauce}
	}

	next();
};


module.exports = { checkFile, checkData, setupData };