const User = require('./User.model');
const { BadRequest, Unauthorized } = require('../errors');

const signup = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		await User.create({ email, password });

		res.status(201).json({
			message: 'Your account has been successfully created',
		});
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new BadRequest('Please provide email and password');
		}

		const user = await User.findOne({ email });

		if (!user) {
			throw new Unauthorized('Please provide valid email and password');
		}

		const isPasswordCorrect = await user.comparePassword(password);

		if (!isPasswordCorrect) {
			throw new Unauthorized('Please provide valid email and password');
		}

		const token = user.createJWT();

		res.status(200).json({ userId: user._id, token });
	} catch (error) {
		next(error);
	}
};

module.exports = { signup, login };
