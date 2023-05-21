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
import { NotFound } from '../errors/errors.not-found.js';

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

export class MockSaucesRepository implements SaucesRepository {
  private backupSauces: ISauce[] = [];

  private constructor(
    private sauces: ISauce[],
    private fileHandler: FileHandler | null
  ) {}

  static init(): MockSaucesRepository {
    return new MockSaucesRepository([], null);
  }

  withSauces(sauces: ISauce[]): MockSaucesRepository {
    this.sauces = this.deepSaucesCopy(sauces);
    return this;
  }

  withFileHandler(fileHandler: FileHandler): MockSaucesRepository {
    this.fileHandler = fileHandler;
    return this;
  }

  async getSauce(sauceId: string): Promise<ISauce | null> {
    const sauce = this.sauces.find(({ _id }) => _id === sauceId);

    return sauce ?? null;
  }

  async getAllSauces(): Promise<ISauce[]> {
    return this.sauces;
  }

  async createSauce(sauceData: ICreateSauce): Promise<ISauce> {
    const _id = Math.random().toString(36).slice(2, 7);

    const sauce = {
      ...sauceData,
      _id,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    };

    this.sauces = [...this.sauces, sauce];

    return sauce;
  }

  async updateSauceImage(
    sauceId: string,
    { origin, newFilePath, currentFilePath }: IProvideImageData
  ): Promise<ISauce> {
    const imageUrl = new URL(newFilePath, origin);
    const sauceUpdate = () => {
      return this.updateSauceById(sauceId, { imageUrl });
    };

    return this.performTransaction(sauceUpdate, currentFilePath);
  }

  async updateSauceData(
    sauceId: string,
    updateData: IValidateSauce
  ): Promise<ISauce> {
    return this.updateSauceById(sauceId, updateData);
  }

  async updateSauceStatus(
    sauceId: string,
    statusData: IUpdateSauceStatus
  ): Promise<ISauce> {
    return this.updateSauceById(sauceId, statusData);
  }

  async deleteSauce(sauceId: string, filePath: string): Promise<void> {
    const sauceDeletion = () => {
      const deletedSauce = this.sauces.find(({ _id }) => _id !== sauceId);

      if (!deletedSauce) {
        throw new NotFound(`No sauce with id ${sauceId}`);
      }

      this.sauces = this.sauces.filter(({ _id }) => _id !== sauceId);

      return deletedSauce;
    };

    await this.performTransaction(sauceDeletion, filePath);
  }

  private updateSauceById(
    sauceId: string,
    updateData: IUpdateSauceById
  ): ISauce {
    const sauceIndex = this.sauces.findIndex((sauce) => sauce._id === sauceId);

    if (sauceIndex === -1) {
      throw new NotFound(`No sauce with id ${sauceId}`);
    }

    const currentSauce = this.sauces[sauceIndex];
    const updatedSauce = { ...currentSauce, ...updateData };

    this.sauces = [
      ...this.sauces.slice(0, sauceIndex),
      updatedSauce,
      ...this.sauces.slice(sauceIndex + 1),
    ];

    return updatedSauce;
  }

  private async performTransaction(
    operation: () => ISauce,
    filePath: string
  ): Promise<ISauce> {
    this.backupSauces = this.deepSaucesCopy(this.sauces);

    try {
      const sauce = operation();

      await this.fileHandler?.deleteFile(filePath);

      return sauce;
    } catch (error) {
      this.sauces = this.backupSauces;
      throw error;
    }
  }

  private deepSauceCopy(sauce: ISauce): ISauce {
    return {
      ...sauce,
      imageUrl: new URL(sauce.imageUrl.toString()),
      usersLiked: [...sauce.usersLiked],
      usersDisliked: [...sauce.usersDisliked],
    };
  }

  private deepSaucesCopy(sauces: ISauce[]): ISauce[] {
    return sauces.map((sauce) => this.deepSauceCopy(sauce));
  }
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
