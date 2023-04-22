import express from 'express';
import cors from 'cors';
import path from 'path';
import { authorizeUser } from './middleware/authorization.js';
import {
  fileErrorHandler,
  httpErrorHandler,
  mongooseErrorHandler,
  multerErrorHandler,
} from './middleware/error-handlers.js';
import { router as authRouter } from './users/auth.routes.js';
import { router as saucesRouter } from './sauces/sauces.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

app.use('/api/auth', authRouter);
app.use('/api/sauces', authorizeUser, saucesRouter);

app.use(
  fileErrorHandler,
  httpErrorHandler,
  mongooseErrorHandler,
  multerErrorHandler
);

export { app };
