const Sauce = require('./Sauce.model');
const { NotFound } = require('../errors');

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

module.exports = { findSauceOrThrow };
