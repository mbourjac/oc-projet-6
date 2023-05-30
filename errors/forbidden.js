const HttpError = require('./http-error');

class Forbidden extends HttpError {
	constructor(message) {
		super(message, 403);
	}
}

module.exports = Forbidden;
