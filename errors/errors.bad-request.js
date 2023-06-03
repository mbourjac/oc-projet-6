const HttpError = require('./erros.http-error');

class BadRequest extends HttpError {
	constructor(message) {
		super(message, 400);
	}
}

module.exports = BadRequest;
