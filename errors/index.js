const HttpError = require('./errors.http-error');
const BadRequest = require('./errors.bad-request');
const Unauthorized = require('./errors.unauthorized');
const Forbidden = require('./errors.forbidden');
const NotFound = require('./errors.not-found');
const {
	fileErrorHandler,
	httpErrorHandler,
	mongooseErrorHandler,
	multerErrorHandler,
} = require('./errors.handlers');

module.exports = {
  HttpError,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  fileErrorHandler,
	httpErrorHandler,
	mongooseErrorHandler,
	multerErrorHandler, };
