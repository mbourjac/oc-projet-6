const mongoose = require('mongoose');

const sauceSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: {
		type: String,
		required: true,
		match: /^.{1,14}(?:\s.{1,14})?$/,
	},
	manufacturer: {
		type: String,
		required: true,
		maxLength: 100,
	},
	description: {
		type: String,
		required: true,
		maxLength: 500,
	},
	mainPepper: {
		type: String,
		required: true,
		maxLength: 50,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	heat: {
		type: Number,
		required: true,
		min: 1,
		max: 10,
	},
	likes: {
		type: Number,
		default: 0,
		min: 0,
	},
	dislikes: {
		type: Number,
		default: 0,
		min: 0,
	},
	usersLiked: {
		type: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	usersDisliked: {
		type: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
	},
});

module.exports = mongoose.model('Sauce', sauceSchema);
