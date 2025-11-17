const ApiException = require("../../exceptions/apiException");
const { db } = require("../../utils/db");
const StatusHistoryService = require("../../services/statusHistoryService");

const deleteDonor = async (req, res) => {
  const oldStatus = "ACTIVE";
  const newStatus = "INACTIVE";

  const person = await db.person.findUnique({
    where: {
      public_id: req.user.publicId,
      status: "ACTIVE",
      role: "DONOR",
    },
  });

  if (!person) {
    throw new ApiException("user not found", 404);
  }

  await db.person.update({
    where: {
      public_id: req.user.publicId,
    },
    data: {
      status: "INACTIVE",
    },
  });

  // Registrar histórico de status
  try {
    await StatusHistoryService.recordStatusChange(
      "PERSON",
      person.public_id,
      oldStatus,
      newStatus,
      req.user.publicId, // O próprio doador se inativando
      "Conta de doador desativada (soft delete)",
      {
        action: "DELETE",
      }
    );
  } catch (statusError) {
    console.error(
      "Erro ao registrar status history em deleteDonor:",
      statusError
    );
  }

  res.status(204).send();
};

module.exports = deleteDonor;
