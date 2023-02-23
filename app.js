const express = require('express');
const app = express();

const cors = require('./middleware/cors');
const errorHandler = require('./middleware/error-handler');

const authRouter = require('./users/auth.routes');

app.use(cors);
app.use(express.json());

app.use('/api/auth', authRouter);

app.use(errorHandler);

module.exports = app;
