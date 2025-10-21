const jwt = require("jsonwebtoken");
const { SECRET_KET_JWT } = require("../utils/constants");
const ApiException = require("../exceptions/apiException");

const validateToken = async (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!(authorization && authorization.startsWith("Bearer "))) {
    throw new ApiException("missing token", 403);
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, SECRET_KET_JWT, (error, decoded) => {
    if (error) {
      throw new ApiException(error.message, 401);
    }

    req.user = decoded;
    next();
  });
};

module.exports = validateToken;
