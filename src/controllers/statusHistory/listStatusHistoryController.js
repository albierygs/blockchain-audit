const { db } = require("../../utils/db");

const listStatusHistory = async (_req, res) => {
  const { entityId, entityType } = res.locals;

  const history = await db.status_history.findMany({
    where: {
      entity_id: entityId,
      entity_type: entityType,
    },
    include: {
      chaged_by: {
        select: {
          name: true,
          public_id: true,
        },
      },
    },
    orderBy: {
      changed_at: "desc",
    },
  });

  res.status(200).json(history);
};

module.exports = listStatusHistory;
