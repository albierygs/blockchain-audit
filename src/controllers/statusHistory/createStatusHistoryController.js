const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const createStatusHistory = async (req, res) => {
  const { entityId, entityType } = res.locals;
  const { old_status, new_status, reason, metadata } = req.body;
  const changedByPublicId = req.user.publicId;

  // Validar que new_status é obrigatório
  if (!new_status) {
    throw new ApiException("O novo status é obrigatório", 400);
  }

  // Criar o novo registro de histórico de status
  const newHistory = await db.status_history.create({
    data: {
      entity_id: entityId,
      entity_type: entityType.toUpperCase(),
      old_status,
      new_status,
      reason,
      changed_by_id: changedByPublicId,
      metadata,
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

  res.status(201).json(newHistory);
};

module.exports = createStatusHistory;
