const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const authenticateUser = require('./middlewares/authentication');
const {
	fileErrorHandler,
	httpErrorHandler,
	mongooseErrorHandler,
	multerErrorHandler,
} = require('./errors');
const usersRouter = require('./users/users.routes');
const saucesRouter = require('./sauces/sauces.routes');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', usersRouter);
app.use('/api/sauces', authenticateUser, saucesRouter);

app.use(
	fileErrorHandler,
	httpErrorHandler,
	mongooseErrorHandler,
	multerErrorHandler
);

module.exports = app;
