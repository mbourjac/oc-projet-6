const { BadRequest } = require('../errors');

class AbstractSauceStatus {
	constructor(sauce) {
		this.sauce = sauce;
	}

	resetStatus() {
		throw new Error('Not implemented');
	}

	likeSauce() {
		throw new Error('Not implemented');
	}

	dislikeSauce() {
		throw new Error('Not implemented');
	}

	addUserAsLiker(userId) {
		this.sauce.likes++;
		this.sauce.usersLiked.push(userId);
	}

	addUserAsDisliker(userId) {
		this.sauce.dislikes++;
		this.sauce.usersDisliked.push(userId);
	}

	removeLikerUser(userId) {
		this.sauce.likes--;
		this.sauce.usersLiked = this.sauce.usersLiked.filter(
			(id) => !id.equals(userId)
		);
	}

	removeDislikerUser(userId) {
		this.sauce.dislikes--;
		this.sauce.usersDisliked = this.sauce.usersDisliked.filter(
			(id) => !id.equals(userId)
		);
	}
}

class LikedSauce extends AbstractSauceStatus {
	resetStatus(userId) {
		this.removeLikerUser(userId);
		return new NeutralSauce(this.sauce);
	}

	likeSauce(userId) {
		return this.resetStatus(userId);
	}

	dislikeSauce(userId) {
		this.removeLikerUser(userId);
		this.addUserAsDisliker(userId);
		return new DislikedSauce(this.sauce);
	}
}

class DislikedSauce extends AbstractSauceStatus {
	resetStatus(userId) {
		this.removeDislikerUser(userId);
		return new NeutralSauce(this.sauce);
	}

	likeSauce(userId) {
		this.removeDislikerUser(userId);
		this.addUserAsLiker(userId);
		return new LikedSauce(this.sauce);
	}

	dislikeSauce(userId) {
		return this.resetStatus(userId);
	}
}

class NeutralSauce extends AbstractSauceStatus {
	resetStatus() {
		throw new BadRequest(
			"User hasn't previously set this sauce's like status"
		);
	}

	likeSauce(userId) {
		this.addUserAsLiker(userId);
		return new LikedSauce(this.sauce);
	}

	dislikeSauce(userId) {
		this.addUserAsDisliker(userId);
		return new DislikedSauce(this.sauce);
	}
}

module.exports = { LikedSauce, DislikedSauce, NeutralSauce };
