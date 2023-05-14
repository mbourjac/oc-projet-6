export interface IValidateSauce {
  name: string;
  manufacturer: string;
  description: string;
  mainPepper: string;
  heat: number;
}

export interface ICreateSauce extends IValidateSauce {
  userId: string;
  imageUrl: URL;
}

export interface IUpdateSauce extends IValidateSauce {
  imageUrl: URL | undefined;
}

export interface IUpdateSauceStatus {
  likes: number;
  dislikes: number;
  usersLiked: string[];
  usersDisliked: string[];
}

export interface ISauce extends ICreateSauce, IUpdateSauceStatus {
  _id: string;
}

export interface IProvideFileData {
  filePath: string;
}

export interface IParseSauce {
  sauce?: string;
}

export enum SauceInterest {
  Dislike = -1,
  Neutral,
  Like,
}
