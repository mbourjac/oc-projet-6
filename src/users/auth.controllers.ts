import { User } from './User.model.js';
import { Unauthorized } from '../errors';

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

export { signup, login };
