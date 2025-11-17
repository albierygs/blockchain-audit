const { db } = require("../../utils/db");

const listVolunteerLogs = async (req, res) => {
  const { memberId } = req.params;

  const logs = await db.volunteer_log.findMany({
    where: {
      volunteer_id: memberId,
    },
    include: {
      project: {
        select: {
          title: true,
          public_id: true,
          status: true,
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
    },
    orderBy: {
      date: "desc",
    },
  });

  res.status(200).json(logs);
};

module.exports = listVolunteerLogs;
