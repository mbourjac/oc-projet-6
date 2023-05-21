import { describe, it, expect, beforeEach } from 'vitest';
import {
  ICreateSauce,
  IMayProvideImageData,
  ISauce,
  IValidateSauce,
  SauceInterest,
} from '../src/sauces/sauces.types';
import {
  MockSaucesRepository,
  SaucesRepository,
} from '../src/sauces/sauces.repositories';
import { SaucesService } from '../src/sauces/sauces.service';
import { FileHandler, MockFileHandler } from '../src/sauces/sauces.files';
import { BadRequest, NotFound } from '../src/errors';
import { formatFilePath, deepSauceCopy } from '../src/utils/';

describe('when using a sauce service', () => {
  const mockSauces: ISauce[] = [
    {
      _id: 'cq6u9',
      userId: '422q7',
      name: 'Tabasco',
      manufacturer: 'McIlhenny Company',
      description:
        'Le Tabasco est une sauce pimentée à base de piments rouges mûrs, de vinaigre et de sel',
      mainPepper: 'Piment de Cayenne',
      heat: 7,
      imageUrl: new URL('https://hottakes.com/images/ketchup.jpg'),
      likes: 1,
      dislikes: 2,
      usersLiked: ['422q7'],
      usersDisliked: ['8vb68', 'fnjqb'],
    },
    {
      _id: 'j5ppo',
      userId: '8vb68',
      name: 'Sriracha',
      manufacturer: 'Huy Fong Foods',
      description:
        "La Sriracha est une pâte faite de piments, de vinaigre distillé, d'ail, de sucre et de sel.",
      mainPepper: 'Piment jalapeño',
      heat: 5,
      imageUrl: new URL('https://hottakes.com/images/sriracha.jpg'),
      likes: 2,
      dislikes: 1,
      usersLiked: ['8vb68', 'fnjqb'],
      usersDisliked: ['1jqxb'],
    },
  ];
  const mockFiles = mockSauces.map(({ imageUrl }) =>
    formatFilePath(imageUrl.pathname)
  );

  let saucesRepository: SaucesRepository;
  let saucesService: SaucesService;
  let fileHanlder: FileHandler;

  beforeEach(() => {
    fileHanlder = MockFileHandler.init().withFiles(mockFiles);
    saucesRepository = MockSaucesRepository.init()
      .withSauces(mockSauces)
      .withFileHandler(fileHanlder);
    saucesService = new SaucesService({
      saucesRepository,
    });
  });

  describe('when getting a sauce', () => {
    it('should return a sauce if one exists with the provided id', async () => {
      const sauceId = 'j5ppo';

      const sauce = await saucesService.findSauceOrThrow(sauceId);

      expect(sauce).toEqual(mockSauces[1]);
    });

    it('should throw a NotFound error if no sauce exists with the provided id', async () => {
      const sauceId = '4m9wk';

      await expect(saucesService.findSauceOrThrow(sauceId)).rejects.toThrow(
        new NotFound(`No sauce with id ${sauceId}`)
      );
    });
  });

  describe('when getting all sauces', () => {
    it('should return an array of all sauces in the repository', async () => {
      const sauces = await saucesService.getAllSauces();

      expect(sauces).toEqual(mockSauces);
    });
  });

  describe('when creating a sauce', () => {
    const newSauceData: ICreateSauce = {
      userId: 'kv3qq',
      name: 'Cholula',
      manufacturer: 'McCormick & Co',
      description:
        'La sauce piquante Cholula contient des piment de árbol et piquin sélectionnés avec soin, ainsi qu’un mélange d’épices emblématiques qui lui donnent une saveur unique.',
      mainPepper: 'Piment de árbol',
      heat: 8,
      imageUrl: new URL('https://hottakes.com/images/cholula.jpg'),
    };

    it('should return a sauce with the provided data', async () => {
      const createdSauce = await saucesService.createSauce(newSauceData);

      expect(createdSauce).toMatchObject(newSauceData);
    });

    it('should assign an _id to the created sauce', async () => {
      const createdSauce = await saucesService.createSauce(newSauceData);

      expect(createdSauce._id).toBeDefined();
    });

    it('should initialize likes and dislikes counts to 0 for the created sauce', async () => {
      const createdSauce = await saucesService.createSauce(newSauceData);

      expect(createdSauce.likes).toBe(0);
      expect(createdSauce.dislikes).toBe(0);
    });

    it('should initialize usersLiked and usersDisliked as empty arrays for the created sauce', async () => {
      const createdSauce = await saucesService.createSauce(newSauceData);

      expect(createdSauce.usersLiked).toEqual([]);
      expect(createdSauce.usersDisliked).toEqual([]);
    });

    it('should add the created sauce to the repository', async () => {
      const createdSauce = await saucesService.createSauce(newSauceData);

      const allSauces = await saucesService.getAllSauces();

      expect(allSauces).toContainEqual(createdSauce);
      expect(allSauces).toHaveLength(3);
    });
  });

  describe('when updating a sauce', () => {
    const sauceId = 'cq6u9';
    const updateData: IValidateSauce = {
      name: 'Tabasco',
      manufacturer: 'McIlhenny Company',
      description:
        'Le Tabasco est une sauce pimentée à base de piments rouges mûrs, de vinaigre et de sel',
      mainPepper: 'Capsicum frutescens',
      heat: 7,
    };

    describe('when no file is provided', () => {
      it('should update the sauce with the provided data', async () => {
        const imageData: IMayProvideImageData = {
          origin: 'https://hottakes.com',
          newFilePath: undefined,
          currentFilePath: 'images/ketchup.jpg',
        };

        const updatedSauce = await saucesService.updateSauce(
          sauceId,
          updateData,
          imageData
        );

        expect(updatedSauce).toMatchObject(updateData);
      });
    });

    describe('when a new file is provided', () => {
      const imageData: IMayProvideImageData = {
        origin: 'https://hottakes.com',
        newFilePath: 'images/tabasco.jpg',
        currentFilePath: 'images/ketchup.jpg',
      };

      it('should update the sauce with the provided data', async () => {
        const updatedSauce = await saucesService.updateSauce(
          sauceId,
          updateData,
          imageData
        );

        expect(updatedSauce).toMatchObject(updateData);
      });

      it('should update the image URL of the sauce', async () => {
        const updatedSauce = await saucesService.updateSauce(
          sauceId,
          updateData,
          imageData
        );

        expect(updatedSauce.imageUrl).toEqual(
          new URL('https://hottakes.com/images/tabasco.jpg')
        );
      });

      it('should remove the associated file', async () => {
        await saucesService.updateSauce(sauceId, updateData, imageData);

        const files = await fileHanlder.readFiles('images');

        expect(files).not.toContain('ketchup.jpg');
      });
    });
  });

  describe('when deleting a sauce', () => {
    const sauceId = 'j5ppo';

    it('should delete the sauce with the provided id', async () => {
      const filePath = 'images/sriracha.jpg';

      await saucesService.deleteSauce(sauceId, filePath);

      await expect(saucesService.findSauceOrThrow(sauceId)).rejects.toThrow(
        new NotFound(`No sauce with id ${sauceId}`)
      );
    });

    it('should remove the associated file', async () => {
      const filePath = 'images/sriracha.jpg';

      await saucesService.deleteSauce(sauceId, filePath);

      const files = await fileHanlder.readFiles('images');

      expect(files).not.toContain('sriracha.jpg');
    });

    it('should revert the operation if an error occurs', async () => {
      const filePath = 'images/cholula.jpg';

      fileHanlder = MockFileHandler.init().withException();
      saucesRepository = MockSaucesRepository.init()
        .withSauces(mockSauces)
        .withFileHandler(fileHanlder);
      saucesService = new SaucesService({
        saucesRepository,
      });

      await expect(
        saucesService.deleteSauce(sauceId, filePath)
      ).rejects.toThrow(new Error(`Failed to delete file ${filePath}`));

      const sauce = await saucesService.findSauceOrThrow(sauceId);

      expect(sauce).toBeDefined();
    });
  });

  describe('when updating the sauce like status', () => {
    describe('when a sauce is neutral', () => {
      const userId = '422q7';

      describe('when a user resets his interest', () => {
        it('should throw a BadRequest error', async () => {
          const sauce = deepSauceCopy(mockSauces[1]);
          const sauceInterest = SauceInterest.Neutral;

          await expect(
            saucesService.updateSauceStatus(sauce, userId, sauceInterest)
          ).rejects.toThrow(
            new BadRequest(
              `User ${userId} hasn't previously set this sauce's like status`
            )
          );
        });
      });

      describe('when a user likes the sauce', () => {
        it('should add the user as liker', async () => {
          const sauce = deepSauceCopy(mockSauces[1]);
          const sauceInterest = SauceInterest.Like;

          const updatedSauce = await saucesService.updateSauceStatus(
            sauce,
            userId,
            sauceInterest
          );

          expect(updatedSauce.likes).toBe(3);
          expect(updatedSauce.usersLiked).toContain(userId);
        });
      });

      describe('when a user dislikes the sauce', () => {
        it('should add the user as disliker', async () => {
          const sauce = deepSauceCopy(mockSauces[1]);
          const sauceInterest = SauceInterest.Dislike;

          const updatedSauce = await saucesService.updateSauceStatus(
            sauce,
            userId,
            sauceInterest
          );

          expect(updatedSauce.dislikes).toBe(2);
          expect(updatedSauce.usersDisliked).toContain(userId);
        });
      });
    });

    describe('when a sauce is liked', () => {
      const userId = '422q7';

      describe('when a user resets his interest', () => {
        it('should remove the user as liker', async () => {
          const sauce = deepSauceCopy(mockSauces[0]);
          const sauceInterest = SauceInterest.Neutral;

          const updatedSauce = await saucesService.updateSauceStatus(
            sauce,
            userId,
            sauceInterest
          );

          expect(updatedSauce.likes).toBe(0);
          expect(updatedSauce.usersLiked).not.toContain(userId);
        });
      });

      describe('when a user likes the sauce', () => {
        it('should remove the user as liker', async () => {
          const sauce = deepSauceCopy(mockSauces[0]);
          const sauceInterest = SauceInterest.Like;

          const updatedSauce = await saucesService.updateSauceStatus(
            sauce,
            userId,
            sauceInterest
          );

          expect(updatedSauce.likes).toBe(0);
          expect(updatedSauce.usersLiked).not.toContain(userId);
        });
      });

      describe('when a user dislikes the sauce', () => {
        it('should remove the user as liker', async () => {
          const sauce = deepSauceCopy(mockSauces[0]);
          const sauceInterest = SauceInterest.Dislike;

          await saucesService.updateSauceStatus(sauce, userId, sauceInterest);

          const updatedSauce = await saucesService.findSauceOrThrow(sauce._id);

          expect(updatedSauce.likes).toBe(0);
          expect(updatedSauce.usersLiked).not.toContain(userId);
        });

        it('should add the user as disliker', async () => {
          const sauce = deepSauceCopy(mockSauces[0]);
          const sauceInterest = SauceInterest.Dislike;

          await saucesService.updateSauceStatus(sauce, userId, sauceInterest);

          const updatedSauce = await saucesService.findSauceOrThrow(sauce._id);

          expect(updatedSauce.dislikes).toBe(3);
          expect(updatedSauce.usersDisliked).toContain(userId);
        });
      });
    });

    describe('when a sauce is disliked', () => {
      const userId = '8vb68';

      describe('when a user resets his interest', () => {
        it('should remove the user as disliker', async () => {
          const sauce = deepSauceCopy(mockSauces[0]);
          const sauceInterest = SauceInterest.Neutral;

          const updatedSauce = await saucesService.updateSauceStatus(
            sauce,
            userId,
            sauceInterest
          );

          expect(updatedSauce.dislikes).toBe(1);
          expect(updatedSauce.usersDisliked).not.toContain(userId);
        });
      });

      describe('when a user dislikes the sauce', () => {
        it('should remove the user as disliker', async () => {
          const sauce = deepSauceCopy(mockSauces[0]);
          const sauceInterest = SauceInterest.Dislike;

          const updatedSauce = await saucesService.updateSauceStatus(
            sauce,
            userId,
            sauceInterest
          );

          expect(updatedSauce.dislikes).toBe(1);
          expect(updatedSauce.usersDisliked).not.toContain(userId);
        });
      });

      describe('when a user likes the sauce', () => {
        it('should remove the user as disliker', async () => {
          const sauce = deepSauceCopy(mockSauces[0]);
          const sauceInterest = SauceInterest.Like;

          await saucesService.updateSauceStatus(sauce, userId, sauceInterest);

          const updatedSauce = await saucesService.findSauceOrThrow(sauce._id);

          expect(updatedSauce.dislikes).toBe(1);
          expect(updatedSauce.usersDisliked).not.toContain(userId);
        });

        it('should add the user as liker', async () => {
          const sauce = deepSauceCopy(mockSauces[0]);
          const sauceInterest = SauceInterest.Like;

          await saucesService.updateSauceStatus(sauce, userId, sauceInterest);

          const updatedSauce = await saucesService.findSauceOrThrow(sauce._id);

          expect(updatedSauce.likes).toBe(2);
          expect(updatedSauce.usersLiked).toContain(userId);
        });
      });
    });
  });
});
