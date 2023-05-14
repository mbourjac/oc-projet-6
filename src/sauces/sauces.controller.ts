import { RequestHandler } from 'express';
import {
  IProvideSauceData,
  IProvideSauceInterest,
  IValidateSauce,
  IProvideFileData,
} from './sauces.types.js';
import { SaucesService } from './sauces.service.js';
import { sauceDependencies } from './sauces.dependencies.js';
import {
  ITypeRequestBodyAndLocals,
  ITypeRequestLocals,
} from '../request/request.types.js';
import { IAuthenticateUser } from '../authentication/authentication.types.js';

class SaucesController {
  constructor(private readonly saucesService: SaucesService) {}

  getAllSauces: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const sauces = await this.saucesService.getAllSauces();

      res.status(200).json(sauces);
    } catch (error) {
      next(error);
    }
  };

  createSauce: RequestHandler = async (
    req: ITypeRequestBodyAndLocals<
      IValidateSauce,
      IAuthenticateUser & IProvideFileData
    >,
    res,
    next
  ): Promise<void> => {
    try {
      const { userId, filePath } = req.locals;
      const { name, manufacturer, description, mainPepper, heat } = req.body;
      const imageUrl = new URL(
        filePath,
        `${req.protocol}://${req.get('host')}`
      );

      const sauce = await this.saucesService.createSauce({
        userId,
        name,
        manufacturer,
        description,
        mainPepper,
        heat,
        imageUrl,
      });

      res.status(201).json({ message: 'Sauce created', sauce });
    } catch (error) {
      next(error);
    }
  };

  getSauce: RequestHandler = (
    req: ITypeRequestLocals<IProvideSauceData>,
    res
  ): void => {
    const { sauce } = req.locals;

    res.status(200).json(sauce);
  };

  updateSauce: RequestHandler = async (
    req: ITypeRequestBodyAndLocals<
      IValidateSauce,
      IProvideSauceData & Partial<IProvideFileData>
    >,
    res,
    next
  ): Promise<void> => {
    try {
      const { sauce, filePath } = req.locals;
      const { name, manufacturer, description, mainPepper, heat } = req.body;
      const imageUrl = filePath
        ? new URL(filePath, `${req.protocol}://${req.get('host')}`)
        : undefined;

      const updatedSauce = await this.saucesService.updateSauce(sauce, {
        name,
        manufacturer,
        description,
        mainPepper,
        heat,
        imageUrl,
      });

      res.status(200).json({ message: 'Sauce updated', updatedSauce });
    } catch (error) {
      next(error);
    }
  };

  deleteSauce: RequestHandler = async (
    req: ITypeRequestLocals<IProvideSauceData>,
    res,
    next
  ): Promise<void> => {
    try {
      const { sauce } = req.locals;

      this.saucesService.deleteSauce(sauce);

      res.status(200).json({ message: 'Sauce deleted' });
    } catch (error) {
      next(error);
    }
  };

  updateLikeStatus: RequestHandler = async (
    req: ITypeRequestBodyAndLocals<
      IProvideSauceInterest,
      IAuthenticateUser & IProvideSauceData
    >,
    res,
    next
  ): Promise<void> => {
    try {
      const { sauce, userId } = req.locals;
      const sauceInterest = req.body.like;
      const updatedSauce = this.saucesService.updateSauceStatus(
        sauce,
        userId,
        sauceInterest
      );

      res.status(200).json({ message: 'Like status updated', updatedSauce });
    } catch (error) {
      next(error);
    }
  };
}

export const saucesController = new SaucesController(
  SaucesService.getInstance(sauceDependencies)
);
