import { Schema, Types, model } from 'mongoose';
import { IValidateSauce } from './sauces.types';

export interface IMongoSauce extends IValidateSauce {
  userId: Types.ObjectId;
  imageUrl: string;
  likes: number;
  dislikes: number;
  usersLiked: Types.Array<Types.ObjectId>;
  usersDisliked: Types.Array<Types.ObjectId>;
}

const sauceSchema = new Schema<IMongoSauce>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    match: /^.{1,14}(?:\s.{1,14})?$/,
  },
  manufacturer: {
    type: String,
    required: true,
    maxLength: 100,
  },
  description: {
    type: String,
    required: true,
    maxLength: 500,
  },
  mainPepper: {
    type: String,
    required: true,
    maxLength: 50,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  heat: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  dislikes: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  usersLiked: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    required: true,
    default: [],
  },
  usersDisliked: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    required: true,
    default: [],
  },
});

export const Sauce = model<IMongoSauce>('Sauce', sauceSchema);
