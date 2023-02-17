const { HttpError } = require('../errors');

const errorHandler = (err, req, res, next) => {
	if (err instanceof HttpError) {
		return res.status(err.statusCode).json({
			name: err.name,
			status: err.statusCode,
			message: err.message,
			stack: err.stack,
		});
	}

	return res.status(500).json({
		message: err.message ?? 'Something went wrong, try again later',
	});
};

module.exports = errorHandler;
