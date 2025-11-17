const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const getStatusHistory = async (req, res) => {
  const { historyId } = req.params;
  const { entityId, entityType } = res.locals;

  const history = await db.status_history.findFirst({
    where: {
      public_id: historyId,
      entity_id: entityId,
      entity_type: entityType.toUpperCase(),
    },
    include: {
      chaged_by: {
        select: {
          name: true,
          public_id: true,
        },
      },
    },
  });

  if (!history) {
    throw new ApiException(
      "Registro de histórico de status não encontrado",
      404
    );
  }

  res.status(200).json(history);
};

module.exports = getStatusHistory;
