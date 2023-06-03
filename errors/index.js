const HttpError = require('./erros.http-error');
const BadRequest = require('./errors.bad-request');
const Unauthorized = require('./errors.unauthorized');
const Forbidden = require('./errors.forbidden');
const NotFound = require('./errors.not-found');

module.exports = { HttpError, BadRequest, Unauthorized, Forbidden, NotFound };
