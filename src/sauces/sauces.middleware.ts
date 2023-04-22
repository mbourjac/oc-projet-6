import { Sauce } from './Sauce.model.js';
import { Unauthorized, NotFound } from '../errors';

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
    const action = req.method === 'PUT' ? 'update' : 'delete';

    if (!sauce.userId.equals(userId)) {
      throw new Unauthorized(`You are not authorized to ${action} this sauce`);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { findSauceOrThrow, canManageSauce };
