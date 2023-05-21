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

export interface IUpdateSauceImage {
  imageUrl: URL;
}

export interface IUpdateSauceStatus {
  likes: number;
  dislikes: number;
  usersLiked: string[];
  usersDisliked: string[];
}

export type IUpdateSauceById =
  | IValidateSauce
  | IUpdateSauceImage
  | IUpdateSauceStatus;

export interface ISauce extends ICreateSauce, IUpdateSauceStatus {
  _id: string;
}

export interface IMayProvideImageData {
  newFilePath: string | undefined;
  currentFilePath: string;
  origin: string;
}

export interface IProvideImageData extends IMayProvideImageData {
  newFilePath: string;
}

export interface IProvideFileData {
  filePath: string;
}

export interface IParseSauce {
  sauce?: string;
}

export interface IProvideSauceData {
  sauce: ISauce;
}

export interface IProvideSauceInterest {
  like: SauceInterest;
}

export interface ISetupSauceData extends Partial<IValidateSauce>, IParseSauce {}

export enum SauceInterest {
  Dislike = -1,
  Neutral,
  Like,
}
