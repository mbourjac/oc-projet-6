export interface IValidateSauce {
  name: string;
  manufacturer: string;
  description: string;
  mainPepper: string;
  heat: number;
}

export interface IProvideFileData {
  filePath: string;
}

export interface IParseSauce {
  sauce?: string;
}
