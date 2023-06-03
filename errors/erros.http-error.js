class HttpError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
	}

	toJSON() {
		return {
			name: this.name,
			statusCode: this.statusCode,
			message: this.message,
		};
	}
}

module.exports = HttpError;
