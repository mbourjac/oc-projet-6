import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { BadRequest } from '../errors';

type FileExtension = 'jpg' | 'png';
const MimeTypesMapping = new Map<string, FileExtension>();

MimeTypesMapping.set('image/jpg', 'jpg');
MimeTypesMapping.set('image/jpeg', 'jpg');
MimeTypesMapping.set('image/png', 'png');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const extension: FileExtension | undefined = MimeTypesMapping.get(
      file.mimetype
    );

    if (extension) {
      callback(null, `${file.fieldname}-${Date.now()}.${extension}`);
    } else {
      callback(new Error('Invalid file mimetype'), '');
    }
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (MimeTypesMapping.has(file.mimetype)) {
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
