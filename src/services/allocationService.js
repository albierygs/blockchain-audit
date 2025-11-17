const { db } = require("../utils/db");

/**
 * Serviço de Alocação
 *
 * Fornece métodos para gerenciar alocações, incluindo:
 * - Cálculo de saldo disponível
 * - Validação de alocações
 * - Rastreamento de alocações por doação
 */

class AllocationService {
  /**
   * Calcula o valor total já alocado para uma doação
   * @param {string} donationId - ID da doação
   * @returns {Promise<number>} Valor total alocado
   */
  static async getTotalAllocatedAmount(donationId) {
    const result = await db.allocation.aggregate({
      where: {
        donation_id: donationId,
      },
      _sum: {
        amount_allocated: true,
      },
    });

    return result._sum.amount_allocated
      ? parseFloat(result._sum.amount_allocated)
      : 0;
  }

  /**
   * Calcula o saldo disponível de uma doação
   * @param {string} donationId - ID da doação
   * @returns {Promise<number>} Saldo disponível
   */
  static async getAvailableBalance(donationId) {
    // Obter valor total da doação
    const donation = await db.donation.findUnique({
      where: {
        public_id: donationId,
      },
      select: {
        value: true,
      },
    });

    if (!donation) {
      throw new Error("Doação não encontrada");
    }

    // Calcular valor total já alocado
    const totalAllocated = await this.getTotalAllocatedAmount(donationId);

    // Calcular saldo disponível
    const availableBalance = parseFloat(donation.value) - totalAllocated;

    return availableBalance;
  }

  /**
   * Obtém informações detalhadas de alocação de uma doação
   * @param {string} donationId - ID da doação
   * @returns {Promise<Object>} Informações de alocação
   */
  static async getAllocationInfo(donationId) {
    const donation = await db.donation.findUnique({
      where: {
        public_id: donationId,
      },
      select: {
        public_id: true,
        value: true,
        status: true,
      },
    });

    if (!donation) {
      throw new Error("Doação não encontrada");
    }

    const totalAllocated = await this.getTotalAllocatedAmount(donationId);
    const availableBalance = await this.getAvailableBalance(donationId);

    const allocations = await db.allocation.findMany({
      where: {
        donation_id: donationId,
      },
      select: {
        public_id: true,
        project_id: true,
        amount_allocated: true,
        allocation_date: true,
        project: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        allocation_date: "desc",
      },
    });

    return {
      donation: {
        public_id: donation.public_id,
        total_value: parseFloat(donation.value),
        status: donation.status,
      },
      allocation_summary: {
        total_allocated: totalAllocated,
        available_balance: availableBalance,
        allocation_percentage:
          ((totalAllocated / parseFloat(donation.value)) * 100).toFixed(2) +
          "%",
      },
      allocations,
    };
  }

  /**
   * Valida se é possível alocar um valor para uma doação
   * @param {string} donationId - ID da doação
   * @param {number} amountToAllocate - Valor a alocar
   * @returns {Promise<Object>} Resultado da validação
   */
  static async validateAllocation(donationId, amountToAllocate) {
    const donation = await db.donation.findUnique({
      where: {
        public_id: donationId,
      },
      select: {
        value: true,
        status: true,
      },
    });

    if (!donation) {
      return {
        isValid: false,
        error: "Doação não encontrada",
        code: "DONATION_NOT_FOUND",
      };
    }

    // Verificar se a doação está confirmada
    if (donation.status !== "CONFIRMED") {
      return {
        isValid: false,
        error: `Não é possível alocar de uma doação com status ${donation.status}. A doação deve estar CONFIRMED.`,
        code: "DONATION_NOT_CONFIRMED",
      };
    }

    // Verificar se o valor a alocar é positivo
    if (amountToAllocate <= 0) {
      return {
        isValid: false,
        error: "O valor a alocar deve ser positivo",
        code: "INVALID_AMOUNT",
      };
    }

    // Calcular saldo disponível
    const availableBalance = await this.getAvailableBalance(donationId);

    // Verificar se há saldo suficiente
    if (amountToAllocate > availableBalance) {
      return {
        isValid: false,
        error: `Saldo insuficiente. Disponível: ${availableBalance}, Solicitado: ${amountToAllocate}`,
        code: "INSUFFICIENT_BALANCE",
        details: {
          donation_value: parseFloat(donation.value),
          total_allocated: parseFloat(donation.value) - availableBalance,
          available_balance: availableBalance,
          requested_amount: amountToAllocate,
        },
      };
    }

    return {
      isValid: true,
      details: {
        donation_value: parseFloat(donation.value),
        total_allocated: parseFloat(donation.value) - availableBalance,
        available_balance: availableBalance,
        requested_amount: amountToAllocate,
        remaining_after_allocation: availableBalance - amountToAllocate,
      },
    };
  }

  /**
   * Obtém todas as alocações de uma doação
   * @param {string} donationId - ID da doação
   * @returns {Promise<Array>} Lista de alocações
   */
  static async getAllocationsByDonation(donationId) {
    const allocations = await db.allocation.findMany({
      where: {
        donation_id: donationId,
      },
      include: {
        project: {
          select: {
            public_id: true,
            title: true,
          },
        },
      },
      orderBy: {
        allocation_date: "desc",
      },
    });

    return allocations;
  }

  /**
   * Calcula o percentual de alocação de uma doação
   * @param {string} donationId - ID da doação
   * @returns {Promise<number>} Percentual (0-100)
   */
  static async getAllocationPercentage(donationId) {
    const donation = await db.donation.findUnique({
      where: {
        public_id: donationId,
      },
      select: {
        value: true,
      },
    });

    if (!donation) {
      throw new Error("Doação não encontrada");
    }

    const totalAllocated = await this.getTotalAllocatedAmount(donationId);
    const percentage = (totalAllocated / parseFloat(donation.value)) * 100;

    return Math.min(percentage, 100); // Garantir que não ultrapasse 100%
  }
}

module.exports = AllocationService;
