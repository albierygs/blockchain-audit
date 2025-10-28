const ApiException = require("../exceptions/apiException");
const { db } = require("../utils/db");

const validateParamId = (type) => async (req, _res, next) => {
  const { id } = req.params;

  if (req.user.role !== "ADMIN") {
    if (type === "SELF") {
      if (req.user.publicId != id) {
        throw new ApiException("acess denied", 401);
      }
    } else if (type === "MEMBER_TO_ORGANIZATION") {
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

      if (!member || member.organization.public_id != id) {
        throw new ApiException("access denied", 401);
      }
    } else if (type === "ORG_PEER_ACTION") {
      await db.$transaction(async (tx) => {
        const memberToken = await tx.organization_member.findUnique({
          where: {
            public_id: req.user.publicId,
            status: "ACTIVE",
          },
          select: {
            organization_id: true,
          },
        });

        const memberParam = await tx.organization_member.findUnique({
          where: {
            public_id: req.params.id,
            status: "ACTIVE",
          },
          select: {
            organization_id: true,
          },
        });

        if (!memberParam) {
          throw new ApiException("Member not found", 404);
        }

        if (req.params.id === req.user.publicId) {
          throw new ApiException(
            "Forbidden: Cannot perform this action on yourself",
            403
          );
        }

        if (memberToken.organization_id !== memberParam.organization_id) {
          throw new ApiException(
            "Forbidden: Cannot act on members of another organization",
            403
          );
        }
      });
    } else if (type === "ORG_PEER_ACCESS") {
      if (req.user.memberRole !== "ORG_ADMIN") {
        await db.$transaction(async (tx) => {
          const memberToken = await tx.organization_member.findUnique({
            where: {
              public_id: req.user.publicId,
              status: "ACTIVE",
            },
            select: {
              organization_id: true,
            },
          });

          const memberParam = await tx.organization_member.findUnique({
            where: {
              public_id: req.params.id,
              status: "ACTIVE",
            },
            select: {
              organization_id: true,
            },
          });

          if (!memberParam) {
            throw new ApiException("Member not found", 404);
          }

          if (req.params.id !== req.user.publicId) {
            throw new ApiException(
              "Forbidden: Cannot access another member",
              403
            );
          }

          if (memberToken.organization_id !== memberParam.organization_id) {
            throw new ApiException(
              "Forbidden: Cannot access member from another organization",
              403
            );
          }
        });
      }
    } else if (type === "ORG_PROJECT_ACTION") {
      if (req.user.role === "ORG_MEMBER") {
        const member = await db.organization_member.findUnique({
          where: { public_id: req.user.publicId },
          select: { organization_id: true },
        });

        const project = await db.project.findUnique({
          where: { public_id: id },
          select: { organization_id: true },
        });

        if (!project || project.organization_id !== member.organization_id) {
          throw new ApiException(
            "Access denied: Project does not belong to your organization",
            403
          );
        }
      }
    } else if (type === "ORG_PROJECT_ACCESS") {
      const project = await db.project.findUnique({
        where: { public_id: id },
        select: { organization_id: true },
      });

      if (!project) {
        throw new ApiException("Project not found", 404);
      }

      if (req.user.role === "ORG_MEMBER") {
        const member = await db.organization_member.findUnique({
          where: { public_id: req.user.publicId },
          select: { organization_id: true },
        });

        if (project.organization_id !== member.organization_id) {
          throw new ApiException(
            "Access denied: Project does not belong to your organization",
            403
          );
        }
      }
    } else {
      throw new ApiException("Invalid entity type for ID validation", 500);
    }
  }
  next();
};

module.exports = validateParamId;
