const HttpError = require('./http-error');

class BadRequest extends HttpError {
	constructor(message) {
		super(message);
		this.statusCode = 400;
	}
}

module.exports = BadRequest;
