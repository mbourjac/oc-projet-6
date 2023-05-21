import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { IValidateUser } from './users.types';

const userSchema = new Schema<IValidateUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  password: {
    type: String,
    required: true,
    match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
    minLength: 8,
  },
});

userSchema.plugin(uniqueValidator);

export const User = model<IValidateUser>('User', userSchema);
