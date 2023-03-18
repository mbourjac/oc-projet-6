const mongoose = require('mongoose');
const Sauce = require('./Sauce.model');
const { unlink } = require('fs/promises');
const { BadRequest } = require('../errors');

const getAllSauces = async (req, res, next) => {
	try {
		const sauces = await Sauce.find();

		res.status(200).json(sauces);
	} catch (error) {
		next(error);
	}
};

const createSauce = async (req, res, next) => {
	try {
		const { name, manufacturer, description, mainPepper, heat } = req.body;
		const sauce = await Sauce.create({
			name,
			manufacturer,
			description,
			mainPepper,
			heat,
			userId: req.user.userId,
			imageUrl: new URL(
				req.file.path,
				`${req.protocol}://${req.get('host')}`
			),
		});

		res.status(201).json({ message: 'Sauce created' });
	} catch (error) {
		next(error);
	}
};

const getSauce = async (req, res, next) => {
	try {
		const { sauce } = req;

		res.status(200).json(sauce);
	} catch (error) {
		next(error);
	}
};

const updateSauce = async (req, res, next) => {
	try {
		const { sauce } = req;
		const { name, manufacturer, description, mainPepper, heat } = req.body;

		sauce.name = name;
		sauce.manufacturer = manufacturer;
		sauce.description = description;
		sauce.mainPepper = mainPepper;
		sauce.heat = heat;

		if (req.file) {
			const filename = sauce.imageUrl.split('/').pop();

			await unlink(`images/${filename}`);

			sauce.imageUrl = new URL(
				req.file.path,
				`${req.protocol}://${req.get('host')}`
			);
		}

		sauce.save();

		res.status(200).json({ message: 'Sauce updated' });
	} catch (error) {
		next(error);
	}
};

const deleteSauce = async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { sauce } = req;
		const filename = sauce.imageUrl.split('/').pop();

		await sauce.deleteOne({ session });
		await unlink(`images/${filename}`);
		await session.commitTransaction();

		res.status(200).json({ message: 'Sauce deleted' });
	} catch (error) {
		await session.abortTransaction();
		next(error);
	} finally {
		session.endSession();
	}
};

const updateLikeStatus = async (req, res, next) => {
	try {
		const { sauce } = req;
		const { userId } = req.user;
		const { like } = req.body;

		const isLiked = sauce.usersLiked.includes(userId);
		const isDisliked = sauce.usersDisliked.includes(userId);

		if (like === 1) {
			if (isLiked) {
				throw new BadRequest('User has already liked the sauce');
			}

			sauce.likes++;
			sauce.usersLiked.push(userId);

			if (isDisliked) {
				sauce.dislikes--;
				sauce.usersDisliked = sauce.usersDisliked.filter(
					(id) => !id.equals(userId)
				);
			}
		}

		if (like === -1) {
			if (isDisliked) {
				throw new BadRequest('User has already disliked the sauce');
			}

			sauce.dislikes++;
			sauce.usersDisliked.push(userId);

			if (isLiked) {
				sauce.likes--;
				sauce.usersLiked = sauce.usersLiked.filter(
					(id) => !id.equals(userId)
				);
			}
		}

		if (like === 0) {
			if (isLiked) {
				sauce.likes--;
				sauce.usersLiked = sauce.usersLiked.filter(
					(id) => !id.equals(userId)
				);
			} else if (isDisliked) {
				sauce.dislikes--;
				sauce.usersDisliked = sauce.usersDisliked.filter(
					(id) => !id.equals(userId)
				);
			} else {
				throw new BadRequest(
					"User hasn't previously liked / disliked the sauce"
				);
			}
		}

		await sauce.save();

		res.status(200).json({ message: 'Like status updated' });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllSauces,
	createSauce,
	getSauce,
	updateSauce,
	deleteSauce,
	updateLikeStatus,
};
