import { PasswordHasher, bcryptPasswordHasher } from './users.password.js';
import { UsersRepository, mongoUsersRepository } from './users.repositories.js';

export interface IUsersDependencies {
  usersRepository: UsersRepository;
  passwordHasher: PasswordHasher;
}

class UsersDependencies implements IUsersDependencies {
  readonly usersRepository: UsersRepository;
  readonly passwordHasher: PasswordHasher;

  constructor() {
    this.usersRepository = mongoUsersRepository;
    this.passwordHasher = bcryptPasswordHasher;
  }
}

export const usersDependencies = new UsersDependencies();
