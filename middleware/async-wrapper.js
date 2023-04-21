const asyncWrapper = (asyncFunction) => {
	return async (req, res, next) => {
		try {
			await asyncFunction(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};

module.exports = asyncWrapper;
