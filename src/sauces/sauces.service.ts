import { NotFound } from '../errors';
import { SaucesRepository } from './sauces.repositories';
import {
  ICreateSauce,
  IMayProvideImageData,
  ISauce,
  IValidateSauce,
  SauceInterest,
} from './sauces.types';
import {
  SauceStatus,
  DislikedSauce,
  LikedSauce,
  NeutralSauce,
} from './sauces.status';
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
    sauceId: string,
    updateData: IValidateSauce,
    { newFilePath, currentFilePath, origin }: IMayProvideImageData
  ): Promise<ISauce> {
    let updatedSauce = await this.saucesRepository.updateSauceData(
      sauceId,
      updateData
    );

    if (newFilePath) {
      updatedSauce = await this.saucesRepository.updateSauceImage(sauceId, {
        newFilePath,
        currentFilePath,
        origin,
      });
    }

    return updatedSauce;
  }

  async deleteSauce(sauceId: string, filePath: string): Promise<void> {
    await this.saucesRepository.deleteSauce(sauceId, filePath);
  }

  async updateSauceStatus(
    sauce: ISauce,
    userId: string,
    sauceInterest: SauceInterest
  ): Promise<ISauce> {
    const sauceStatus = this.getSauceStatus(sauce, userId);
    const updatedSauceStatus =
      sauceInterest === 1
        ? sauceStatus.likeSauce(userId)
        : sauceInterest === -1
        ? sauceStatus.dislikeSauce(userId)
        : sauceStatus.resetInterest(userId);

    const updatedSauce = updatedSauceStatus.getStatusData();

    return this.saucesRepository.updateSauceStatus(sauce._id, updatedSauce);
  }

  private getSauceStatus(sauce: ISauce, userId: string): SauceStatus {
    const sauceStatus = sauce.usersLiked.includes(userId)
      ? new LikedSauce(sauce)
      : sauce.usersDisliked.includes(userId)
      ? new DislikedSauce(sauce)
      : new NeutralSauce(sauce);

    return sauceStatus;
  }
}
