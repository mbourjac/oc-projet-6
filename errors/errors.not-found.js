const HttpError = require('./erros.http-error');

class NotFound extends HttpError {
	constructor(message) {
		super(message, 404);
	}
}

module.exports = NotFound;
