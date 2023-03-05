const { HttpError } = require('../errors');

const errorHandler = (error, req, res, next) => {
	if (error instanceof HttpError) {
		console.error(error);
		return res.status(error.statusCode).json({ error });
	}

	if (error.name === 'ValidationError' || error.name === 'CastError') {
		console.error(error);
		return res.status(400).json({ error });
	}

	next(error);
};

module.exports = errorHandler;
