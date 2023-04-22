import { BadRequest } from '../errors';

const dataCheck = (req, res, next) => {
  if (req.file && !req.body.sauce) {
    throw new BadRequest('Please provide required information');
  }

  next();
};

export { dataCheck };
