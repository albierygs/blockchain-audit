const { db } = require("../../utils/db");

const listAllStatusHistory = async (req, res) => {
  const { entityType, entityId, changedById, startDate, endDate } = req.query;

  // Construir o filtro dinamicamente
  const where = {};

  if (entityType) {
    where.entity_type = entityType.toUpperCase();
  }

  if (entityId) {
    where.entity_id = entityId;
  }

  if (changedById) {
    where.changed_by_id = changedById;
  }

  if (startDate || endDate) {
    where.changed_at = {};
    if (startDate) {
      where.changed_at.gte = new Date(startDate);
    }
    if (endDate) {
      where.changed_at.lte = new Date(endDate);
    }
  }

  const history = await db.status_history.findMany({
    where,
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

module.exports = listAllStatusHistory;
