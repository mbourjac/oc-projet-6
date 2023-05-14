import { NotFound } from '../errors';
import { SaucesRepository } from './sauces.repositories.js';
import {
  ICreateSauce,
  ISauce,
  IUpdateSauce,
  SauceInterest,
} from './sauces.types.js';
import {
  SauceStatus,
  DislikedSauce,
  LikedSauce,
  NeutralSauce,
} from './sauces.status.js';
import { ISaucesDependencies } from './sauces.dependencies';

export class SaucesService {
  private static instance: SaucesService;
  private readonly saucesRepository: SaucesRepository;

  constructor({ saucesRepository }: ISaucesDependencies) {
    this.saucesRepository = saucesRepository;
  }

  static getInstance(saucesDependencies: ISaucesDependencies): SaucesService {
    if (!SaucesService.instance) {
      SaucesService.instance = new SaucesService(saucesDependencies);
    }

    return SaucesService.instance;
  }

  async findSauceOrThrow(sauceId: string): Promise<ISauce> {
    const sauce = await this.saucesRepository.getSauce(sauceId);

    if (!sauce) {
      throw new NotFound(`No sauce with id ${sauceId}`);
    }

    return sauce;
  }

  async getAllSauces(): Promise<ISauce[]> {
    return this.saucesRepository.getAllSauces();
  }

  async createSauce(sauceData: ICreateSauce): Promise<ISauce> {
    return this.saucesRepository.createSauce(sauceData);
  }

  async updateSauce(
    sauce: ISauce,
    {
      name,
      manufacturer,
      description,
      mainPepper,
      heat,
      imageUrl,
    }: IUpdateSauce
  ): Promise<ISauce> {
    sauce.name = name;
    sauce.manufacturer = manufacturer;
    sauce.description = description;
    sauce.mainPepper = mainPepper;
    sauce.heat = heat;

    if (imageUrl) {
      const filename = this.getSauceFilename(sauce.imageUrl);

      sauce.imageUrl = imageUrl;
      await this.saucesRepository.updateSauceWithFile(sauce, filename);
    } else {
      await this.saucesRepository.updateSauce(sauce);
    }

    return sauce;
  }

  async deleteSauce(sauce: ISauce): Promise<void> {
    const filename = this.getSauceFilename(sauce.imageUrl);

    await this.saucesRepository.deleteSauce(sauce, filename);
  }

  async updateSauceStatus(
    sauce: ISauce,
    userId: string,
    sauceInterest: SauceInterest
  ): Promise<ISauce> {
    const sauceStatus = this.getSauceStatus(sauce, userId);
    const updatedStatus =
      sauceInterest === 1
        ? sauceStatus.likeSauce(userId)
        : sauceInterest === -1
        ? sauceStatus.dislikeSauce(userId)
        : sauceStatus.resetInterest(userId);

    const updatedSauce = updatedStatus.getSauce();

    await this.saucesRepository.updateSauce(updatedSauce);

    return updatedSauce;
  }

  private getSauceStatus(sauce: ISauce, userId: string): SauceStatus {
    const sauceStatus = sauce.usersLiked.includes(userId)
      ? new LikedSauce(sauce)
      : sauce.usersDisliked.includes(userId)
      ? new DislikedSauce(sauce)
      : new NeutralSauce(sauce);

    return sauceStatus;
  }

  private getSauceFilename(imageUrl: URL): string {
    const pathname = imageUrl.pathname;
    return pathname.substring(pathname.lastIndexOf('/') + 1);
  }
}
