const express = require('express');
const app = express();

const cors = require('cors');
const path = require('path');
const authorizeUser = require('./middleware/authorization');
const {
	fileErrorHandler,
	httpErrorHandler,
	mongooseErrorHandler,
	multerErrorHandler,
} = require('./middleware/error-handlers');

const authRouter = require('./users/auth.routes');
const saucesRouter = require('./sauces/sauces.routes');

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRouter);
app.use('/api/sauces', authorizeUser, saucesRouter);

app.use(
	fileErrorHandler,
	httpErrorHandler,
	mongooseErrorHandler,
	multerErrorHandler
);

module.exports = app;
