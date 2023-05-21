import { HydratedDocument, startSession, ClientSession } from 'mongoose';
import {
  ISauce,
  ICreateSauce,
  IUpdateSauceStatus,
  IUpdateSauceById,
  IProvideImageData,
  IValidateSauce,
} from './sauces.types.js';
import { IMongoSauce, Sauce } from './Sauce.model.js';
import { FileHandler } from './sauces.files.js';

export interface SaucesRepository {
  getSauce(sauceId: string): Promise<ISauce | null>;
  getAllSauces(): Promise<ISauce[]>;
  createSauce(sauceData: ICreateSauce): Promise<ISauce>;
  updateSauceData(sauceId: string, sauceData: IValidateSauce): Promise<ISauce>;
  updateSauceImage(
    sauceId: string,
    imageData: IProvideImageData
  ): Promise<ISauce>;
  updateSauceStatus(
    sauceId: string,
    statusData: IUpdateSauceStatus
  ): Promise<ISauce>;
  deleteSauce(sauceId: string, filePath: string): Promise<void>;
}

export class MongoSaucesRepository implements SaucesRepository {
  private static instance: MongoSaucesRepository;

  constructor(private readonly fileHandler: FileHandler) {}

  static getInstance(fileHandler: FileHandler): MongoSaucesRepository {
    if (!MongoSaucesRepository.instance) {
      MongoSaucesRepository.instance = new MongoSaucesRepository(fileHandler);
    }

    return MongoSaucesRepository.instance;
  }

  async getSauce(sauceId: string): Promise<ISauce | null> {
    const sauce = await Sauce.findById(sauceId);

    return sauce ? this.standardizeSauce(sauce) : null;
  }

  async getAllSauces(): Promise<ISauce[]> {
    const sauces = await Sauce.find();

    return sauces.map((sauce) => this.standardizeSauce(sauce));
  }

  async createSauce(sauceData: ICreateSauce): Promise<ISauce> {
    const createdSauce = await Sauce.create(sauceData);

    return this.standardizeSauce(createdSauce);
  }

  async updateSauceData(
    sauceId: string,
    sauceData: IValidateSauce
  ): Promise<ISauce> {
    return this.updateSauceById(sauceId, sauceData);
  }

  async updateSauceImage(
    sauceId: string,
    { origin, newFilePath, currentFilePath }: IProvideImageData
  ): Promise<ISauce> {
    const session = await startSession();
    const imageUrl = new URL(newFilePath, origin);
    const sauceUpdate = async () => {
      return this.updateSauceById(sauceId, { imageUrl });
    };

    return this.performTransaction(sauceUpdate, session, currentFilePath);
  }

  async updateSauceStatus(
    sauceId: string,
    statusData: IUpdateSauceStatus
  ): Promise<ISauce> {
    return this.updateSauceById(sauceId, statusData);
  }

  async deleteSauce(sauceId: string, filePath: string): Promise<void> {
    const session = await startSession();
    const sauceDeletion = async () => {
      const deletedSauce = await Sauce.findByIdAndDelete(sauceId, {
        session,
      }).orFail();

      return this.standardizeSauce(deletedSauce);
    };

    await this.performTransaction(sauceDeletion, session, filePath);
  }

  private async updateSauceById(sauceId: string, updateData: IUpdateSauceById) {
    const updatedSauce = await Sauce.findByIdAndUpdate(sauceId, updateData, {
      new: true,
      runValidators: true,
    }).orFail();

    return this.standardizeSauce(updatedSauce);
  }

  private async performTransaction(
    dbOperation: () => Promise<ISauce>,
    session: ClientSession,
    currentFilePath: string
  ): Promise<ISauce> {
    session.startTransaction();
    try {
      const sauce = await dbOperation();

      await this.fileHandler.deleteFile(currentFilePath);
      await session.commitTransaction();

      return sauce;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private standardizeSauce({
    _id,
    userId,
    name,
    manufacturer,
    description,
    mainPepper,
    heat,
    imageUrl,
    likes,
    dislikes,
    usersLiked,
    usersDisliked,
  }: HydratedDocument<IMongoSauce>): ISauce {
    return {
      _id: _id.toString(),
      userId: userId.toString(),
      name,
      manufacturer,
      description,
      mainPepper,
      heat,
      imageUrl: new URL(imageUrl),
      likes,
      dislikes,
      usersLiked: usersLiked.map((userId) => userId.toString()),
      usersDisliked: usersDisliked.map((userId) => userId.toString()),
    };
  }
}
