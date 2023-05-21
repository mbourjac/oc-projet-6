import { RequestHandler } from 'express';
import { IValidateUser } from './users.types.js';
import { UsersService } from './users.service.js';
import { usersDependencies } from './users.dependencies.js';
import { AuthnService } from '../authn/authn.service.js';
import { authnDependencies } from '../authn/authn.dependencies.js';

class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authnService: AuthnService
  ) {}

  signup: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { email, password }: IValidateUser = req.body;

      await this.userService.signupUser({ email, password });

      res.status(201).json({
        message: 'Your account has been successfully created',
      });
    } catch (error) {
      next(error);
    }
  };

  login: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { email, password }: IValidateUser = req.body;
      const userId = await this.userService.loginUser({
        email,
        password,
      });
      const token = this.authnService.createToken(userId);

      res.status(200).json({ userId, token });
    } catch (error) {
      next(error);
    }
  };
}

export const usersController = new UsersController(
  UsersService.getInstance(usersDependencies),
  AuthnService.getInstance(authnDependencies)
);
