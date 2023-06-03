const Sauce = require('./Sauce.model');
const { NotFound, Forbidden } = require('../errors');

const findSauceOrThrow = async (req, res, next) => {
	try {
		const sauceId = req.params.id;
		const sauce = await Sauce.findById(sauceId);

		if (!sauce) {
			throw new NotFound(`No sauce with id ${sauceId}`);
		}

		req.sauce = sauce;

		next();
	} catch (error) {
		next(error);
	}
};

const authorizeUser = async (req, res, next) => {
	try {
		const { sauce } = req;
		const { userId } = req.user;
		const action = req.method === 'PUT' ? 'update' : 'delete';

		if (!sauce.userId.equals(userId)) {
			throw new Forbidden(
				`You are not authorized to ${action} this sauce`
			);
		}

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { findSauceOrThrow, authorizeUser };
