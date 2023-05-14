import express from 'express';
import cors from 'cors';
import path from 'path';
import { authenticateUser } from './authentication/authentication.middleware.js';
import {
  fileErrorHandler,
  httpErrorHandler,
  mongooseErrorHandler,
  multerErrorHandler,
} from './errors/errors.handlers.js';
import { authRouter } from './users/users.routes.js';
import { saucesRouter } from './sauces/sauces.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

app.use('/api/auth', authRouter);
app.use('/api/sauces', authenticateUser, saucesRouter);

app.use(
  fileErrorHandler,
  httpErrorHandler,
  mongooseErrorHandler,
  multerErrorHandler
);
