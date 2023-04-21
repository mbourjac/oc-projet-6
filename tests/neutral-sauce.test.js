import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { NeutralSauce } from '../sauces/sauces.interest';
import { BadRequest } from '../errors';

describe('when a sauce is neutral', () => {
	const userId = mongoose.Types.ObjectId();
	let sauce, neutralSauce;

	beforeEach(() => {
		sauce = {
			likes: 0,
			dislikes: 0,
			usersLiked: [],
			usersDisliked: [],
		};

		neutralSauce = new NeutralSauce(sauce);
	});

	describe('when a user resets his interest', () => {
		it('should throw a BadRequest error', () => {
			expect(() => neutralSauce.resetInterest(userId)).toThrowError(
				new BadRequest(
					"User hasn't previously set this sauce's like status"
				)
			);
		});
	});

	describe('when a user likes the sauce', () => {
		it('should add the user as liker', () => {
			const likedSauce = neutralSauce.likeSauce(userId);
			const { likes, usersLiked } = likedSauce.sauce;

			expect(likes).toBe(1);
			expect(usersLiked).toContain(userId);
		});
	});

	describe('when a user dislikes the sauce', () => {
		it('should add the user as disliker', () => {
			const dislikedSauce = neutralSauce.dislikeSauce(userId);
			const { dislikes, usersDisliked } = dislikedSauce.sauce;

			expect(dislikes).toBe(1);
			expect(usersDisliked).toContain(userId);
		});
	});
});
