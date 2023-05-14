import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { BadRequest } from '../errors';

type FileExtension = 'jpg' | 'png';

const MIME_TYPES: Record<string, FileExtension> = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const extension: FileExtension = MIME_TYPES[file.mimetype];
    callback(null, `${file.fieldname}-${Date.now()}.${extension}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (file.mimetype in MIME_TYPES) {
    callback(null, true);
  } else {
    callback(new BadRequest('Only JPEG, JPG, and PNG files are allowed'));
  }
};

export const multerSetup = multer({
  fileFilter,
  storage,
  limits: {
    fileSize: 1024 * 1024,
  },
}).single('image');
