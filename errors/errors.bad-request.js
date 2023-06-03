const HttpError = require('./errors.http-error');

class BadRequest extends HttpError {
	constructor(message) {
		super(message, 400);
	}
}

module.exports = BadRequest;
