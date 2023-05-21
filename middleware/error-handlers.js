const multer = require('multer');
const { unlink } = require('fs/promises');
const { HttpError } = require('../errors');

const fileErrorHandler = async (error, req, res, next) => {
	if (req.file) {
		await unlink(req.file.path);
	}

	next(error);
};

const httpErrorHandler = (error, req, res, next) => {
	if (error instanceof HttpError) {
		console.error(error);
		res.status(error.statusCode).json({ error });
    return;
	}

	next(error);
};

const mongooseErrorHandler = (error, req, res, next) => {
	if (error.name === 'ValidationError' || error.name === 'CastError') {
		console.error(error);
		res.status(400).json({ error });
    return;
	}

	next(error);
};

const multerErrorHandler = (error, req, res, next) => {
	if (error instanceof multer.MulterError) {
		console.error(error);
		res.status(500).json({ error });
    return;
	}

	next(error);
};

module.exports = {
	fileErrorHandler,
	httpErrorHandler,
	mongooseErrorHandler,
	multerErrorHandler,
};
