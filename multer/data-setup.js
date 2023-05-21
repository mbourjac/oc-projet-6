const dataSetup = (req, res, next) => {
	if (req.file) {
		const sauce = JSON.parse(req.body.sauce);

		req.body = {...req.body, ...sauce}
	}

	next();
};

module.exports = dataSetup;
