const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const StatusHistoryService = require("../../services/statusHistoryService");
const AllocationService = require("../../services/allocationService");
const ProjectService = require("../../services/projectService");

const updateAllocation = async (req, res) => {
  const { allocationId } = req.params;
  const { amount_allocated, status } = req.body;

  // Verificar se a alocação existe
  const allocation = await db.allocation.findUnique({
    where: {
      public_id: allocationId,
    },
    include: {
      donation: {
        select: {
          public_id: true,
          value: true,
        },
      },
    },
  });

  if (!allocation) {
    throw new ApiException("Alocação não encontrada", 404);
  }

  // Preparar dados de atualização
  const updateData = {};
  let oldAmount = parseFloat(allocation.amount_allocated);
  let newAmount = oldAmount;

  // Se o valor está sendo alterado, validar usando AllocationService
  if (amount_allocated) {
    newAmount = parseFloat(amount_allocated);

    // Calcular a diferença
    const amountDifference = newAmount - oldAmount;

    // Se a diferença é positiva (aumentando alocação), validar saldo
    if (amountDifference > 0) {
      const validation = await AllocationService.validateAllocation(
        allocation.donation_id,
        amountDifference
      );

      if (!validation.isValid) {
        throw new ApiException(validation.error, 400);
      }
    }

    updateData.amount_allocated = newAmount;
  }

  // Validar transição de status
  if (
    status &&
    !StatusHistoryService.isValidStatusTransition(
      "ALLOCATION",
      "PENDING",
      status
    )
  ) {
    throw new ApiException(
      `Não é possível alterar para o status ${status}`,
      400
    );
  }

  // Atualizar a alocação
  const updatedAllocation = await db.allocation.update({
    where: {
      public_id: allocationId,
    },
    data: updateData,
    include: {
      donation: {
        select: {
          public_id: true,
          value: true,
        },
      },
      project: {
        select: {
          public_id: true,
          title: true,
        },
      },
      organization: {
        select: {
          public_id: true,
          name: true,
        },
      },
    },
  });

  // Atualizar collected_amount do projeto
  const updatedProject = await ProjectService.updateCollectedAmount(
    allocation.project_id
  );

  // Registrar mudança de status no status_history (se houver mudança de status)
  if (status) {
    await StatusHistoryService.recordStatusChange(
      "ALLOCATION",
      allocationId,
      "PENDING",
      status,
      `Status alterado para ${status}`,
      {
        old_amount: oldAmount,
        new_amount: newAmount,
      }
    );
  }

  // Registrar mudança de valor no status_history (se houver mudança de valor)
  if (amount_allocated && oldAmount !== newAmount) {
    await StatusHistoryService.recordStatusChange(
      "ALLOCATION",
      allocationId,
      "PENDING",
      "PENDING",
      `Valor alocado alterado de ${oldAmount} para ${newAmount}`,
      {
        old_amount: oldAmount,
        new_amount: newAmount,
        difference: newAmount - oldAmount,
      }
    );
  }

  // Obter informações de alocação atualizada
  const allocationInfo = await AllocationService.getAllocationInfo(
    allocation.donation_id
  );

  // Obter informações de coleta do projeto
  const projectCollectionInfo = await ProjectService.getCollectionInfo(
    allocation.project_id
  );

  res.status(200).json({
    allocation: updatedAllocation,
    allocation_info: {
      total_allocated: allocationInfo.allocation_summary.total_allocated,
      available_balance: allocationInfo.allocation_summary.available_balance,
      allocation_percentage:
        allocationInfo.allocation_summary.allocation_percentage,
    },
    project_info: {
      collected_amount: updatedProject.collected_amount,
      budget: updatedProject.budget,
      collection_percentage:
        projectCollectionInfo.collection_summary.collection_percentage,
      remaining_amount:
        projectCollectionInfo.collection_summary.remaining_amount,
    },
  });
};

module.exports = updateAllocation;
