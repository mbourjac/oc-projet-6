import { ISauce, ICreateSauce } from './sauces.types.js';

export interface SaucesRepository {
  getSauce(sauceId: string): Promise<ISauce | null>;
  getAllSauces(): Promise<ISauce[]>;
  createSauce(sauceData: ICreateSauce): Promise<ISauce>;
  updateSauce(sauce: ISauce): Promise<void>;
  updateSauceWithFile(sauce: ISauce, filename: string): Promise<void>;
  deleteSauce(sauce: ISauce, filename: string): Promise<void>;
}
