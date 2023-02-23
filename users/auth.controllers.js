const User = require('./User.model');
const { BadRequest, Unauthorized } = require('../errors');

const signup = async (req, res) => {
	try {
		const { email, password } = req.body;

		await User.create({ email, password });

		res.status(201).json({
			message: 'Your account has been successfully created',
		});
	} catch (error) {
		res.status(400).json({ error });
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return next(new BadRequest('Please provide email and password'));
		}

		const user = await User.findOne({ email });

		if (!user) {
			return next(
				new Unauthorized('Please provide valid email and password')
			);
		}

		const isPasswordCorrect = await user.comparePassword(password);

		if (!isPasswordCorrect) {
			return next(
				new Unauthorized('Please provide valid email and password')
			);
		}

		const token = user.createJWT();

		res.status(200).json({ userId: user._id, token });
	} catch (error) {
		res.status(500).json({ error });
	}
};

module.exports = { signup, login };
