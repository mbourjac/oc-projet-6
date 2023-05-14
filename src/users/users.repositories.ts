import { IUser, IValidateUser } from './users.types.js';

export interface UsersRepository {
  getUser(email: string): Promise<IUser | null>;
  createUser(userData: IValidateUser): Promise<IUser>;
}
