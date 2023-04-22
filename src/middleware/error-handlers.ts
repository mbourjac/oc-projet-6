import multer from 'multer';
import { unlink } from 'fs/promises';
import { HttpError } from '../errors';

const fileErrorHandler = async (error, req, res, next) => {
  if (req.file) {
    await unlink(req.file.path);
  }

  next(error);
};

const httpErrorHandler = async (error, req, res, next) => {
  if (error instanceof HttpError) {
    console.error(error);
    return res.status(error.statusCode).json({ error });
  }

  next(error);
};

const mongooseErrorHandler = async (error, req, res, next) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    console.error(error);
    return res.status(400).json({ error });
  }

  next(error);
};

const multerErrorHandler = async (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error(error);
    return res.status(500).json({ error });
  }

  next(error);
};

export {
  fileErrorHandler,
  httpErrorHandler,
  mongooseErrorHandler,
  multerErrorHandler,
};
