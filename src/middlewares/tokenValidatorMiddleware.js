const jwt = require("jsonwebtoken");
const { SECRET_KET_JWT } = require("../utils/constants");
const ApiException = require("../exceptions/apiException");
const { db } = require("../utils/db");

const validateToken = async (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!(authorization && authorization.startsWith("Bearer "))) {
    throw new ApiException("missing token", 403);
  }

  const token = authorization.replace("Bearer ", "");

  const session = await db.session.findUnique({
    where: {
      token: token,
    },
    select: {
      user_id: true,
      revoked: true,
      expires_at: true,
    },
  });

  if (!session || session.revoked || new Date() > session.expires_at) {
    throw new ApiException("Invalid or revoked token", 401);
  }

  jwt.verify(token, SECRET_KET_JWT, (error, decoded) => {
    if (error) {
      throw new ApiException(error.message, 401);
    }

    if (decoded.publicId !== session.user_id) {
      throw new ApiException("Token user mismatch", 401);
    }

    req.user = decoded;
    next();
  });
};

module.exports = validateToken;
