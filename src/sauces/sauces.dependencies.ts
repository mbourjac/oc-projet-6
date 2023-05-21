import { fsFileHandler } from './sauces.files';
import { SaucesRepository, MongoSaucesRepository } from './sauces.repositories';

export interface ISaucesDependencies {
  saucesRepository: SaucesRepository;
}

class SaucesDependencies implements ISaucesDependencies {
  readonly saucesRepository: SaucesRepository;

  constructor() {
    this.saucesRepository = MongoSaucesRepository.getInstance(fsFileHandler);
  }
}

export const sauceDependencies = new SaucesDependencies();
