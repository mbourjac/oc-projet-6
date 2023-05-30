const HttpError = require('./http-error');
const BadRequest = require('./bad-request');
const Unauthorized = require('./unauthorized');
const Forbidden = require('./forbidden');
const NotFound = require('./not-found');

module.exports = { HttpError, BadRequest, Unauthorized, Forbidden, NotFound };
