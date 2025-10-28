const { db } = require("../../utils/db");

const getMemberHistory = async (req, res) => {
  const history = await db.organization_membership.findMany({
    where: {
      member_id: req.params.memberId,
    },
    select: {
      organization: {
        select: {
          name: true,
          public_id: true,
        },
      },
      hired_by: {
        select: {
          name: true,
        },
      },
      terminated_by: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      hired_at: "desc",
    },
  });

  res.status(200).json(history);
};

module.exports = getMemberHistory;
