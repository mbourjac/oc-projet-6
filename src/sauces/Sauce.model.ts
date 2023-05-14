import { Schema, Types, model } from 'mongoose';

const sauceSchema = new Schema({
  userId: {
    type: Types.ObjectId,
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
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
    required: true,
  },
  usersDisliked: {
    type: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
    required: true,
  },
});

const Sauce = model('Sauce', sauceSchema);

export { Sauce };
