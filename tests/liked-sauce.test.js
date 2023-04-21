import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { LikedSauce } from '../sauces/sauces.interest';

describe('when a sauce is liked', () => {
	const userId = mongoose.Types.ObjectId();
	let sauce, likedSauce;

	beforeEach(() => {
		sauce = {
			likes: 1,
			dislikes: 0,
			usersLiked: [userId],
			usersDisliked: [],
		};

		likedSauce = new LikedSauce(sauce);
	});

	describe('when a user resets his interest', () => {
		it('should remove the user as liker', () => {
			const neutralSauce = likedSauce.resetInterest(userId);
			const { likes, usersLiked } = neutralSauce.sauce;

			expect(likes).toBe(0);
			expect(usersLiked).not.toContain(userId);
		});
	});

	describe('when a user likes the sauce', () => {
		it('should remove the user as liker', () => {
			const neutralSauce = likedSauce.likeSauce(userId);
			const { likes, usersLiked } = neutralSauce.sauce;

			expect(likes).toBe(0);
			expect(usersLiked).not.toContain(userId);
		});
	});

	describe('when a user dislikes the sauce', () => {
		it('should remove the user as liker', () => {
			const dislikedSauce = likedSauce.dislikeSauce(userId);
			const { likes, usersLiked } = dislikedSauce.sauce;

			expect(likes).toBe(0);
			expect(usersLiked).not.toContain(userId);
		});

		it('should add the user as disliker', () => {
			const dislikedSauce = likedSauce.dislikeSauce(userId);
			const { dislikes, usersDisliked } = dislikedSauce.sauce;

			expect(dislikes).toBe(1);
			expect(usersDisliked).toContain(userId);
		});
	});
});
