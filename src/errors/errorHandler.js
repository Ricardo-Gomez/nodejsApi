exports.errorHandler = (err, req, res, next) => {
  res.status(err.getStatusCode());

  let response = {
    statusCode: err.getStatusCode(),
    message: err.getMessage(),
  };
  if (err.getError()) {
    response = { ...response, error: err.getError() };
  }
  res.json(response);
};
