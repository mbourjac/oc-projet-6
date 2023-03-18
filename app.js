const express = require('express');
const app = express();

const cors = require('cors');
const path = require('path');
const authorizeUser = require('./middleware/authorization');
const errorHandler = require('./middleware/error-handler');

const authRouter = require('./users/auth.routes');

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRouter);

app.use(errorHandler);

module.exports = app;
