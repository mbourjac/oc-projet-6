const dataSetup = (req, res, next) => {
  if (req.file) {
    const sauce = JSON.parse(req.body.sauce);

    Object.assign(req.body, sauce);
  }

  next();
};

export { dataSetup };
