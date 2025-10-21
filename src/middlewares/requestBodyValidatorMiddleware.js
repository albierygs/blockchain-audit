const validateReqBody = (schema) => async (req, _res, next) => {
  req.body = schema.parse(req.body);
  next();
};

module.exports = validateReqBody;
