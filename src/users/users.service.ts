import { BadRequest, Unauthorized } from '../errors';
import { PasswordHasher } from './users.password.js';
import { UsersRepository } from './users.repositories.js';
import { IValidateUser, IUser } from './users.types.js';
import { IUsersDependencies } from './users.dependencies.js';

export class UsersService {
  private static instance: UsersService;
  private readonly userRepository: UsersRepository;
  private readonly passwordHasher: PasswordHasher;

  constructor({
    usersRepository: userRepository,
    passwordHasher,
  }: IUsersDependencies) {
    this.passwordHasher = passwordHasher;
    this.userRepository = userRepository;
  }

  static getInstance(usersDependencies: IUsersDependencies): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService(usersDependencies);
    }

    return UsersService.instance;
  }

  async signupUser({ email, password }: IValidateUser): Promise<IUser> {
    const existingUser = await this.userRepository.getUser(email);

    if (existingUser) {
      throw new BadRequest('This email is already registered');
    }

    const hashedPassword = await this.passwordHasher.hashPassword(password);
    const user = await this.userRepository.createUser({
      email,
      password: hashedPassword,
    });

    return user;
  }

  async loginUser({
    email,
    password: candidatePassword,
  }: IValidateUser): Promise<string> {
    const { _id: userId, password } = await this.findUserOrThrow(email);
    const isRightPassword = await this.passwordHasher.comparePassword(
      candidatePassword,
      password
    );

    if (!isRightPassword) {
      throw new Unauthorized('Please provide valid email and password');
    }

    return userId;
  }

  private async findUserOrThrow(email: string): Promise<IUser> {
    const user = await this.userRepository.getUser(email);

    if (!user) {
      throw new Unauthorized('Please provide valid email and password');
    }

    return user;
  }
}
