const ApiException = require("../exceptions/apiException");

const authorizesRoles = (allowedRoles, alowwedMemberRoles) => {
  return async (req, _res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiException("Forbidden: insufficient permissions", 403);
    }
    if (
      alowwedMemberRoles &&
      req.user.role === "ORG_MEMBER" &&
      !alowwedMemberRoles.includes(req.user.memberRole)
    ) {
      throw new ApiException("Forbidden: insufficient permissions", 403);
    }
    next();
  };
};

module.exports = authorizesRoles;
