const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const StatusHistoryService = require("../../services/statusHistoryService");
const { createAuditLog } = require("../../services/auditLogService");

const updateDonation = async (req, res) => {
  const { donationId } = req.params;
  const { status, cancellation_reason } = req.body;

  // Verificar se a doação existe
  const donation = await db.donation.findUnique({
    where: {
      public_id: donationId,
    },
  });

  if (!donation) {
    throw new ApiException("Doação não encontrada", 404);
  }

  if (
    status &&
    !StatusHistoryService.isValidStatusTransition(
      "DONATION",
      donation.status,
      status
    )
  ) {
    throw new ApiException(
      `Não é possível alterar de ${donation.status} para ${status}`,
      400
    );
  }

  // Preparar dados de atualização
  const updateData = {};
  if (status) {
    updateData.status = status;
    if (status === "CANCELLED") {
      updateData.cancelled_at = new Date();
      updateData.cancellation_reason = cancellation_reason || null;
    } else if (status === "CONFIRMED") {
      updateData.confirmed_at = new Date();
      updateData.confirmed_by = req.user.publicId;
    }
  }

  // Atualizar a doação
  const updatedDonation = await db.donation.update({
    where: {
      public_id: donationId,
    },
    data: updateData,
    include: {
      donor: {
        select: {
          person: {
            select: {
              name: true,
              public_id: true,
            },
          },
        },
      },
      organization: {
        select: {
          name: true,
          public_id: true,
        },
      },
    },
  });

  if (status) {
    await StatusHistoryService.recordStatusChange(
      "DONATION",
      donationId,
      donation.status,
      status,
      req.user.publicId,
      cancellation_reason || `Status alterado para ${status}`,
      {
        confirmed_at: updateData.confirmed_at,
        cancelled_at: updateData.cancelled_at,
        cancellation_reason: updateData.cancellation_reason,
      }
    );

    await createAuditLog({
      action: "UPDATE_DONATION_STATUS",
      entityType: "DONATION",
      entityId: donationId,
      memberId: req.user.publicId,
      description: `Status changed from ${donation.status} to ${status}`,
      metadata: {
        oldStatus: donation.status,
        newStatus: status,
        cancellationReason: cancellation_reason,
      },
      req,
    });
  }

  res.status(200).json(updatedDonation);
};

module.exports = updateDonation;
