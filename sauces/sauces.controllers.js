const mongoose = require('mongoose');
const { unlink } = require('fs/promises');
const Sauce = require('./Sauce.model');
const {
	LikedSauce,
	DislikedSauce,
	NeutralSauce,
} = require('./sauces.interest');

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
	let session;

	try {
		const { sauce } = req;
		const { name, manufacturer, description, mainPepper, heat } = req.body;

		sauce.name = name;
		sauce.manufacturer = manufacturer;
		sauce.description = description;
		sauce.mainPepper = mainPepper;
		sauce.heat = heat;

		if (req.file) {
			session = await mongoose.startSession();
			session.startTransaction();

			const filename = sauce.imageUrl.split('/').pop();

			await unlink(`images/${filename}`);

			sauce.imageUrl = new URL(
				req.file.path,
				`${req.protocol}://${req.get('host')}`
			);
		}

		await sauce.save({ session });

		if (session) {
			await session.commitTransaction();
			session.endSession();
		}

		res.status(200).json({ message: 'Sauce updated' });
	} catch (error) {
		if (session) {
			await session.abortTransaction();
			session.endSession();
		}

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

		let sauceInterest = sauce.usersLiked.includes(userId)
			? new LikedSauce(sauce)
			: sauce.usersDisliked.includes(userId)
			? new DislikedSauce(sauce)
			: new NeutralSauce(sauce);

		sauceInterest =
			status === 1
				? sauceInterest.likeSauce(userId)
				: status === -1
				? sauceInterest.dislikeSauce(userId)
				: sauceInterest.resetInterest(userId);

		const { likes, dislikes, usersLiked, usersDisliked } =
			sauceInterest.sauce;

		sauce.likes = likes;
		sauce.dislikes = dislikes;
		sauce.usersLiked = usersLiked;
		sauce.usersDisliked = usersDisliked;

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
