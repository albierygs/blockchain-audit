const ApiException = require("../exceptions/apiException");
const { db } = require("../utils/db");

const validateParamId = (entityType) => async (req, _res, next) => {
  const { id } = req.params;

  if (entityType === "PERSON") {
    if (req.user.publicId != id) {
      throw new ApiException("acess denied", 401);
    }
  } else if (entityType === "ORGANIZATION") {
    if (req.user.role === "ORG_MEMBER") {
      const member = await db.organization_member.findUnique({
        where: {
          public_id: req.user.publicId,
        },
        select: {
          public_id: true,
          organization: {
            select: {
              public_id: true,
            },
          },
        },
      });

      if (member.organization.public_id != id) {
        throw new ApiException("access denied", 401);
      }
    }
  } else {
    throw new ApiException("Invalid entity type for ID validation", 500);
  }
  next();
};

module.exports = validateParamId;
