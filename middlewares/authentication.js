const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors');

const authenticateUser = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer')) {
		throw new Unauthorized('Invalid authorization header');
	}

	const token = authHeader.split(' ')[1];

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);

		req.user = { userId: payload.userId };
		next();
	} catch (error) {
		res.status(401).json({ error });
	}
};

module.exports = authenticateUser;
