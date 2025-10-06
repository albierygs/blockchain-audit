const ApiException = require("../exceptions/apiException");

const validateParam = (req, _res, next) => {
  if (req.userPublicId != req.params.id) {
    throw new ApiException("acess denied", 403);
  }
  next();
};

module.exports = validateParam;
