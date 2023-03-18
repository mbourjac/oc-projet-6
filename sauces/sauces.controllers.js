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
		const { like: status } = req.body;

		const LIKE = {
			counter: 'likes',
			users: 'usersLiked',
			action: 'liked',
		};
		const DISLIKE = {
			counter: 'dislikes',
			users: 'usersDisliked',
			action: 'disliked',
		};

		const getCurrentStatus = () => {
			const isLiked = sauce.usersLiked.includes(userId);
			const isDisliked = sauce.usersDisliked.includes(userId);

			return isLiked ? LIKE : isDisliked ? DISLIKE : null;
		};

		const updateCurrentStatus = ({ counter, users }) => {
			sauce[counter]--;
			sauce[users] = sauce[users].filter((id) => !id.equals(userId));
		};

		const setNewStatus = ({ counter, users, action }) => {
			if (sauce[users].includes(userId)) {
				throw new BadRequest(`User has already ${action} this sauce`);
			}

			const currentStatus = getCurrentStatus();

			if (currentStatus) {
				updateCurrentStatus(currentStatus);
			}

			sauce[counter]++;
			sauce[users].push(userId);
		};

		switch (status) {
			case 1:
				setNewStatus(LIKE);
				break;
			case -1:
				setNewStatus(DISLIKE);
				break;
			case 0:
				const currentStatus = getCurrentStatus();

				if (!currentStatus) {
					throw new BadRequest(
						"User hasn't previously set this sauce's like status"
					);
				}

				updateCurrentStatus(currentStatus);
				break;
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
