const { db } = require("../utils/db");
const crypto = require("crypto");

/**
 * Serviço Genérico de Blockchain para Fins Acadêmicos
 *
 * Este serviço fornece uma solução genérica para registro de transações blockchain
 * sem depender de uma rede blockchain real.
 *
 * Características:
 * - Geração de hashes simulados
 * - Suporte a múltiplas redes (Ethereum, Polygon, etc.)
 * - Simulação de confirmações de bloco
 * - Registro de logs de blockchain
 */

class BlockchainService {
  /**
   * Gera um hash simulado para a transação
   * @param {Object} data - Dados da transação
   * @returns {string} Hash simulado
   */
  static generateHash(data) {
    const content = JSON.stringify(data);
    return "0x" + crypto.createHash("sha256").update(content).digest("hex");
  }

  /**
   * Registra uma transação blockchain
   * @param {Object} transactionData - Dados da transação
   * @returns {Promise<Object>} Transação criada
   */
  static async recordTransaction(transactionData) {
    const {
      type,
      network = "ETHEREUM_TESTNET",
      value,
      donation_id,
      allocation_id,
      from_address,
      to_address,
      gas_used,
      gas_price,
    } = transactionData;

    // Gerar hash simulado
    const hash = this.generateHash({
      type,
      value,
      timestamp: new Date().toISOString(),
      random: Math.random(),
    });

    // Simular número de bloco (incremento aleatório)
    const block_number = Math.floor(Math.random() * 1000000) + 1;

    // Criar a transação blockchain
    const blockchainTransaction = await db.blockchain_transaction.create({
      data: {
        hash,
        type,
        block_number,
        network,
        timestamp: new Date(),
        value: parseFloat(value),
        gas_used: gas_used ? parseFloat(gas_used) : null,
        gas_price: gas_price ? parseFloat(gas_price) : null,
        from_address,
        to_address,
        status: "CONFIRMED", // Simulado como confirmado imediatamente
        confirmations: 12, // Simulado com 12 confirmações
        donation_id,
        allocation_id,
      },
      include: {
        blockchain_logs: true,
      },
    });

    // Registrar log da transação
    await this.logTransaction(
      blockchainTransaction.public_id,
      "TRANSACTION_CREATED"
    );

    return blockchainTransaction;
  }

  /**
   * Registra um log de blockchain
   * @param {string} transactionId - ID da transação
   * @param {string} message - Mensagem do log
   * @param {Object} metadata - Dados adicionais
   * @returns {Promise<Object>} Log criado
   */
  static async logTransaction(transactionId, message) {
    const blockchainTransaction = await db.blockchain_transaction.findUnique({
      where: {
        public_id: transactionId,
      },
    });

    if (!blockchainTransaction) {
      throw new Error("Transação blockchain não encontrada");
    }

    const log = await db.blockchain_log.create({
      data: {
        transaction_id: blockchainTransaction.public_id,
        message,
        level: "INFO",
        timestamp: new Date(),
      },
    });

    return log;
  }

  /**
   * Simula a confirmação de uma transação
   * @param {string} transactionId - ID da transação
   * @returns {Promise<Object>} Transação atualizada
   */
  static async confirmTransaction(transactionId) {
    const transaction = await db.blockchain_transaction.findUnique({
      where: {
        public_id: transactionId,
      },
    });

    if (!transaction) {
      throw new Error("Transação blockchain não encontrada");
    }

    const updatedTransaction = await db.blockchain_transaction.update({
      where: {
        public_id: transactionId,
      },
      data: {
        status: "CONFIRMED",
        confirmations: 12,
      },
    });

    await this.logTransaction(transactionId, "TRANSACTION_CONFIRMED", {
      confirmations: 12,
    });

    return updatedTransaction;
  }

  /**
   * Simula a falha de uma transação
   * @param {string} transactionId - ID da transação
   * @param {string} reason - Motivo da falha
   * @returns {Promise<Object>} Transação atualizada
   */
  static async failTransaction(transactionId, reason = "Simulação de falha") {
    const transaction = await db.blockchain_transaction.findUnique({
      where: {
        public_id: transactionId,
      },
    });

    if (!transaction) {
      throw new Error("Transação blockchain não encontrada");
    }

    const updatedTransaction = await db.blockchain_transaction.update({
      where: {
        public_id: transactionId,
      },
      data: {
        status: "FAILED",
        confirmations: 0,
      },
    });

    await this.logTransaction(transactionId, "TRANSACTION_FAILED", {
      reason,
    });

    return updatedTransaction;
  }

  /**
   * Obtém informações de uma transação
   * @param {string} transactionId - ID da transação
   * @returns {Promise<Object>} Dados da transação
   */
  static async getTransaction(transactionId) {
    const transaction = await db.blockchain_transaction.findUnique({
      where: {
        public_id: transactionId,
      },
      include: {
        blockchain_logs: {
          orderBy: {
            timestamp: "desc",
          },
        },
        donation: {
          select: {
            public_id: true,
            value: true,
            status: true,
          },
        },
        allocation: {
          select: {
            public_id: true,
            amount_allocated: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new Error("Transação blockchain não encontrada");
    }

    return transaction;
  }

  /**
   * Lista transações com filtros
   * @param {Object} filters - Filtros (network, status, type, etc.)
   * @returns {Promise<Array>} Lista de transações
   */
  static async listTransactions(filters = {}) {
    const where = {};

    if (filters.network) {
      where.network = filters.network;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) {
        where.timestamp.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.timestamp.lte = new Date(filters.endDate);
      }
    }

    const transactions = await db.blockchain_transaction.findMany({
      where,
      include: {
        blockchain_logs: {
          take: 1,
          orderBy: {
            timestamp: "desc",
          },
        },
        donation: {
          select: {
            public_id: true,
            value: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return transactions;
  }

  /**
   * Obtém estatísticas de transações
   * @returns {Promise<Object>} Estatísticas
   */
  static async getStatistics() {
    const [
      totalTransactions,
      confirmedTransactions,
      failedTransactions,
      totalValue,
      byNetwork,
      byType,
    ] = await Promise.all([
      db.blockchain_transaction.count(),
      db.blockchain_transaction.count({ where: { status: "CONFIRMED" } }),
      db.blockchain_transaction.count({ where: { status: "FAILED" } }),
      db.blockchain_transaction.aggregate({
        _sum: {
          value: true,
        },
      }),
      db.blockchain_transaction.groupBy({
        by: ["network"],
        _count: true,
      }),
      db.blockchain_transaction.groupBy({
        by: ["type"],
        _count: true,
      }),
    ]);

    return {
      totalTransactions,
      confirmedTransactions,
      failedTransactions,
      successRate:
        totalTransactions > 0
          ? ((confirmedTransactions / totalTransactions) * 100).toFixed(2) + "%"
          : "0%",
      totalValue: totalValue._sum.value || 0,
      byNetwork: byNetwork.reduce((acc, item) => {
        acc[item.network] = item._count;
        return acc;
      }, {}),
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {}),
    };
  }
}

module.exports = BlockchainService;
