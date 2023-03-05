const HttpError = require('./http-error');

class Unauthorized extends HttpError {
	constructor(message) {
		super(message, 401);
	}
}

module.exports = Unauthorized;
