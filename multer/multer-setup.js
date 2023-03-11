const multer = require('multer');
const { BadRequest } = require('../errors');

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
};

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		const extension = MIME_TYPES[file.mimetype];
		callback(null, `${file.fieldname}-${Date.now()}.${extension}`);
	},
});

const fileFilter = (req, file, callback) => {
	if (file.mimetype in MIME_TYPES) {
		callback(null, true);
	} else {
		callback(new BadRequest('Only JPEG, JPG, and PNG files are allowed'));
	}
};

const multerSetup = multer({
	fileFilter,
	storage,
}).single('image');

module.exports = multerSetup;
