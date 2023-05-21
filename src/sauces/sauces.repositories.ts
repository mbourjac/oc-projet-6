import { HydratedDocument, Types, startSession, ClientSession } from 'mongoose';
import { ISauce, ICreateSauce } from './sauces.types.js';
import { IMongoSauce, Sauce } from './Sauce.model.js';
import { FileHandler } from './sauces.files.js';

export interface SaucesRepository {
  getSauce(sauceId: string): Promise<ISauce | null>;
  getAllSauces(): Promise<ISauce[]>;
  createSauce(sauceData: ICreateSauce): Promise<ISauce>;
  updateSauce(sauce: ISauce): Promise<void>;
  updateSauceWithFile(sauce: ISauce, filename: string): Promise<void>;
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

  async updateSauce(sauce: ISauce): Promise<void> {
    const mongoSauce = this.convertToMongoDocument(sauce);

    await mongoSauce.save();
  }

  async updateSauceWithFile(sauce: ISauce, filename: string): Promise<void> {
    const session = await startSession();
    const mongoSauce = this.convertToMongoDocument(sauce);

    await this.performTransaction(
      async () => {
        await mongoSauce.save({ session });
      },
      session,
      filename
    );
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

  private convertToMongoDocument({
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
  }: ISauce) {
    const rawDocument = {
      _id: new Types.ObjectId(_id),
      userId: new Types.ObjectId(userId),
      name,
      manufacturer,
      description,
      mainPepper,
      heat,
      imageUrl: imageUrl.toString(),
      likes,
      dislikes,
      usersLiked: usersLiked.map((userId) => new Types.ObjectId(userId)),
      usersDisliked: usersDisliked.map((userId) => new Types.ObjectId(userId)),
    };

    return Sauce.hydrate(rawDocument);
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
