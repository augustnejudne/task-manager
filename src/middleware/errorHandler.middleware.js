const errorHandler = (error, req, res, next) => {
  res.status(400).send(error.message);
  next();
};

module.exports = errorHandler;
