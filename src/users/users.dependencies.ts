import { PasswordHasher, bcryptPasswordHasher } from './users.password';
import { UsersRepository, mongoUsersRepository } from './users.repositories';

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
