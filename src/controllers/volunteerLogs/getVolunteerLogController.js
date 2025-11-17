const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const getVolunteerLog = async (req, res) => {
  const { memberId, logId } = req.params;

  const log = await db.volunteer_log.findFirst({
    where: {
      public_id: logId,
      volunteer_id: memberId,
    },
    include: {
      project: {
        select: {
          title: true,
          public_id: true,
          status: true,
          organization_id: true,
        },
      },
      approved_by: {
        select: {
          person: {
            select: {
              name: true,
              public_id: true,
            },
          },
        },
      },
      volunteer: {
        select: {
          person: {
            select: {
              name: true,
              public_id: true,
            },
          },
        },
      },
    },
  });

  if (!log) {
    throw new ApiException("volunteer log not found", 404);
  }

  res.status(200).json(log);
};

module.exports = getVolunteerLog;
