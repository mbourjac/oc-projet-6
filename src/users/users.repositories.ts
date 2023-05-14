import { HydratedDocument, Types } from 'mongoose';
import { User } from './User.model.js';
import { IUser, IValidateUser } from './users.types.js';

export interface UsersRepository {
  getUser(email: string): Promise<IUser | null>;
  createUser(userData: IValidateUser): Promise<IUser>;
}

class MongoUsersRepository implements UsersRepository {
  convertToMongoDocument({ id, email, password }: IUser) {
    const rawDocument = {
      _id: new Types.ObjectId(id),
      email,
      password,
    };

    return User.hydrate(rawDocument);
  }

  async getUser(email: string): Promise<IUser | null> {
    const mongoUser = await User.findOne({ email });

    return mongoUser ? this.standardizeUser(mongoUser) : null;
  }

  async createUser(user: IValidateUser): Promise<IUser> {
    const mongoUser = await User.create(user);
    return this.standardizeUser(mongoUser);
  }

  standardizeUser({
    _id,
    email,
    password,
  }: HydratedDocument<IValidateUser>): IUser {
    return {
      id: _id.toString(),
      email,
      password,
    };
  }
}

export const mongoUsersRepository = new MongoUsersRepository();
