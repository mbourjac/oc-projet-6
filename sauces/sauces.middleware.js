const Sauce = require('./Sauce.model');
const { Unauthorized, NotFound } = require('../errors');

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

const canManageSauce = async (req, res, next) => {
	try {
		const { sauce } = req;
		const { userId } = req.user;

		if (!sauce.userId.equals(userId)) {
			throw new Unauthorized(
				'You are not authorized to perfom this action'
			);
		}

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { findSauceOrThrow, canManageSauce };
