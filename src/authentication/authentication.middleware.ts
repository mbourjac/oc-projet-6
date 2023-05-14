import jwt from 'jsonwebtoken';
import { Unauthorized } from '../errors';

const authorizeUser = (req, res, next) => {
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

export { authorizeUser };
