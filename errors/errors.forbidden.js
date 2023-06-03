const HttpError = require('./erros.http-error');

class Forbidden extends HttpError {
	constructor(message) {
		super(message, 403);
	}
}

module.exports = Forbidden;
