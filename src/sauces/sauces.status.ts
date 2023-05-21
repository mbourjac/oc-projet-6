import { BadRequest } from '../errors';
import { ISauce, IUpdateSauceStatus } from './sauces.types.js';

interface ISauceStatus {
  resetInterest(userId: string): NeutralSauce | never;
  likeSauce(userId: string): NeutralSauce | LikedSauce;
  dislikeSauce(userId: string): NeutralSauce | DislikedSauce;
  addLikerUser(userId: string): void;
  addDislikerUser(userId: string): void;
  removeLikerUser(userId: string): void;
  removeDislikerUser(userId: string): void;
}

export abstract class SauceStatus implements ISauceStatus {
  constructor(protected sauce: ISauce) {}

  abstract resetInterest(userId: string): NeutralSauce | never;

  abstract likeSauce(userId: string): NeutralSauce | LikedSauce;

  abstract dislikeSauce(userId: string): NeutralSauce | DislikedSauce;

  getStatusData(): IUpdateSauceStatus {
    return {
      likes: this.sauce.likes,
      dislikes: this.sauce.dislikes,
      usersLiked: this.sauce.usersLiked,
      usersDisliked: this.sauce.usersDisliked,
    };
  }

  addLikerUser(userId: string): void {
    this.sauce.likes++;
    this.sauce.usersLiked.push(userId);
  }

  addDislikerUser(userId: string): void {
    this.sauce.dislikes++;
    this.sauce.usersDisliked.push(userId);
  }

  removeLikerUser(userId: string): void {
    this.sauce.likes--;
    this.sauce.usersLiked = this.sauce.usersLiked.filter((id) => id !== userId);
  }

  removeDislikerUser(userId: string): void {
    this.sauce.dislikes--;
    this.sauce.usersDisliked = this.sauce.usersDisliked.filter(
      (id) => id !== userId
    );
  }
}

export class LikedSauce extends SauceStatus {
  resetInterest(userId: string): NeutralSauce {
    this.removeLikerUser(userId);
    return new NeutralSauce(this.sauce);
  }

  likeSauce(userId: string): NeutralSauce {
    return this.resetInterest(userId);
  }

  dislikeSauce(userId: string): DislikedSauce {
    this.removeLikerUser(userId);
    this.addDislikerUser(userId);
    return new DislikedSauce(this.sauce);
  }
}

export class NeutralSauce extends SauceStatus {
  resetInterest(userId: string): never {
    throw new BadRequest(
      `User ${userId} hasn't previously set this sauce's like status`
    );
  }

  likeSauce(userId: string): LikedSauce {
    this.addLikerUser(userId);
    return new LikedSauce(this.sauce);
  }

  dislikeSauce(userId: string): DislikedSauce {
    this.addDislikerUser(userId);
    return new DislikedSauce(this.sauce);
  }
}

export class DislikedSauce extends SauceStatus {
  resetInterest(userId: string): NeutralSauce {
    this.removeDislikerUser(userId);
    return new NeutralSauce(this.sauce);
  }

  likeSauce(userId: string): LikedSauce {
    this.removeDislikerUser(userId);
    this.addLikerUser(userId);
    return new LikedSauce(this.sauce);
  }

  dislikeSauce(userId: string): NeutralSauce {
    return this.resetInterest(userId);
  }
}
