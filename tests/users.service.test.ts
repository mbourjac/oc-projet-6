import { describe, it, expect, beforeEach } from 'vitest';
import {
  UsersRepository,
  MockUsersRepository,
} from '../src/users/users.repositories.js';
import { UsersService } from '../src/users/users.service.js';
import {
  PasswordHasher,
  MockPasswordHasher,
} from '../src/users/users.password.js';
import { IUser, IValidateUser } from '../src/users/users.types.js';
import { BadRequest, Unauthorized } from '../src/errors';

describe('when using a users service', () => {
  const hash = '3DtHeq';
  let mockUsers: IUser[];
  let usersRepository: UsersRepository;
  let usersService: UsersService;
  let passwordHasher: PasswordHasher;

  beforeEach(() => {
    mockUsers = [
      {
        _id: '422q7',
        email: 'jane.doe@gmail.com',
        password: `${hash}3m22EE&auGfS`,
      },
    ];

    usersRepository = MockUsersRepository.init().withUsers(mockUsers);
    passwordHasher = MockPasswordHasher.init().withHash(hash);
    usersService = new UsersService({
      usersRepository,
      passwordHasher,
    });
  });

  describe('when signing up a user', () => {
    describe('when the email is not assigned to an existing user', () => {
      const signupData: IValidateUser = {
        email: 'john.doe@gmail.com',
        password: '2oA4n6StG@fD',
      };

      it('should return a new user with the provided email', async () => {
        const createdUser = await usersService.signupUser(signupData);

        expect(createdUser).toBeDefined();
        expect(createdUser.email).toBe(signupData.email);
      });

      it('should assign an _id to the created user', async () => {
        const createdUser = await usersService.signupUser(signupData);

        expect(createdUser._id).toBeDefined();
      });

      it('should not return the provided password', async () => {
        const createdUser = await usersService.signupUser(signupData);

        expect(createdUser.password).not.toBe(signupData.password);
      });
    });

    describe('when the email is assigned to an existing user', () => {
      it('should throw a BadRequest error', async () => {
        const signupData: IValidateUser = {
          email: 'jane.doe@gmail.com',
          password: '2oA4n6StG@fD',
        };

        await expect(usersService.signupUser(signupData)).rejects.toThrow(
          new BadRequest('This email is already registered')
        );
      });
    });
  });

  describe('when logging in a user', () => {
    describe('when the email and password match an existing user', () => {
      it('should return the user id', async () => {
        const loginData = {
          email: 'jane.doe@gmail.com',
          password: '3m22EE&auGfS',
        };

        const userId = await usersService.loginUser(loginData);

        expect(userId).toBe('422q7');
      });
    });

    describe('when the email does not match any existing user', () => {
      it('should throw a Unauthorized error', async () => {
        const loginData = {
          email: 'john.doe@gmail.com',
          password: '3m22EE&auGfS',
        };

        await expect(usersService.loginUser(loginData)).rejects.toThrow(
          new Unauthorized('Please provide valid email and password')
        );
      });
    });

    describe('when the password is incorrect', () => {
      it('should throw a Unauthorized error', async () => {
        const loginData = {
          email: 'jane.doe@gmail.com',
          password: '2oA4n6StG@fD',
        };

        await expect(usersService.loginUser(loginData)).rejects.toThrow(
          new Unauthorized('Please provide valid email and password')
        );
      });
    });
  });
});
