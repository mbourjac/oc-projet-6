import multer from 'multer';
import { ErrorRequestHandler } from 'express';
import { unlink } from 'fs/promises';
import { HttpError } from './errors.http-error.js';

export const fileErrorHandler: ErrorRequestHandler = async (
  error,
  req,
  res,
  next
): Promise<void> => {
  if (req.file) {
    await unlink(req.file.path);
  }

  next(error);
};

export const httpErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): void => {
  if (error instanceof HttpError) {
    console.error(error);
    res.status(error.statusCode).json({ error });
    return;
  }

  next(error);
};

export const mongooseErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): void => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    console.error(error);
    res.status(400).json({ error });
    return;
  }

  next(error);
};

export const multerErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): void => {
  if (error instanceof multer.MulterError) {
    console.error(error);
    res.status(500).json({ error });
    return;
  }

  next(error);
};
