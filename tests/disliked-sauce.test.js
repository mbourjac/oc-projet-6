import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { DislikedSauce } from '../sauces/sauces.interest';

describe('when a sauce is disliked', () => {
	const userId = mongoose.Types.ObjectId();
	let sauce, dislikedSauce;

	beforeEach(() => {
		sauce = {
			likes: 0,
			dislikes: 1,
			usersLiked: [],
			usersDisliked: [userId],
		};

		dislikedSauce = new DislikedSauce(sauce);
	});

	describe('when a user resets his interest', () => {
		it('should remove the user as disliker', () => {
			const neutralSauce = dislikedSauce.resetInterest(userId);
			const { dislikes, usersDisliked } = neutralSauce.sauce;

			expect(dislikes).toBe(0);
			expect(usersDisliked).not.toContain(userId);
		});
	});

	describe('when a user likes the sauce', () => {
		it('should remove the user as disliker', () => {
			const likedSauce = dislikedSauce.likeSauce(userId);
			const { dislikes, usersDisliked } = likedSauce.sauce;

			expect(dislikes).toBe(0);
			expect(usersDisliked).not.toContain(userId);
		});

		it('should add the user as liker', () => {
			const likedSauce = dislikedSauce.likeSauce(userId);
			const { likes, usersLiked } = likedSauce.sauce;

			expect(likes).toBe(1);
			expect(usersLiked).toContain(userId);
		});
	});

	describe('when a user dislikes the sauce', () => {
		it('should remove the user as disliker', () => {
			const neutralSauce = dislikedSauce.dislikeSauce(userId);
			const { dislikes, usersDisliked } = neutralSauce.sauce;

			expect(dislikes).toBe(0);
			expect(usersDisliked).not.toContain(userId);
		});
	});
});
