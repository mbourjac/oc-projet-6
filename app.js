const express = require('express');
const app = express();

const cors = require('./middleware/cors');
const authRouter = require('./routes/auth.routes');

app.use(cors);
app.use(express.json());

app.use('/api/auth', authRouter);

module.exports = app;
