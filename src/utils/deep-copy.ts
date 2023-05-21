import { ISauce } from '../sauces/sauces.types';

export const deepSauceCopy = (sauce: ISauce): ISauce => {
  return {
    ...sauce,
    imageUrl: new URL(sauce.imageUrl.toString()),
    usersLiked: [...sauce.usersLiked],
    usersDisliked: [...sauce.usersDisliked],
  };
};
