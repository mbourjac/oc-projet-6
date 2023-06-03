const HttpError = require('./errors.http-error');

class NotFound extends HttpError {
	constructor(message) {
		super(message, 404);
	}
}

module.exports = NotFound;
