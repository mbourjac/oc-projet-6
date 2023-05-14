export interface IValidateUser {
  email: string;
  password: string;
}

export interface IUser extends IValidateUser {
  id: string;
}
