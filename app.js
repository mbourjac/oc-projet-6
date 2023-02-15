const express = require('express');
const app = express();

const cors = require('./middleware/cors');

app.use(cors);
app.use(express.json());

module.exports = app;
