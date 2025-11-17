const { db } = require("../utils/db");

/**
 * Serviço Genérico de Status History
 *
 * Fornece métodos para registrar mudanças de status em qualquer entidade
 * (donations, expenses, projects, allocations, etc.)
 */

class StatusHistoryService {
  /**
   * Registra uma mudança de status
   * @param {string} entityType - Tipo de entidade (DONATION, EXPENSE, PROJECT, ALLOCATION, etc.)
   * @param {string} entityId - ID da entidade
   * @param {string} oldStatus - Status anterior
   * @param {string} newStatus - Novo status
   * @param {string} reason - Motivo da mudança (opcional)
   * @param {Object} metadata - Dados adicionais (opcional)
   * @returns {Promise<Object>} Registro de status history criado
   */
  static async recordStatusChange(
    entityType,
    entityId,
    oldStatus,
    newStatus,
    changedById,
    reason = null,
    metadata = null
  ) {
    // Validar que o status realmente mudou
    if (oldStatus === newStatus) {
      console.warn(
        `Status não mudou para ${entityType} ${entityId}: ${oldStatus} → ${newStatus}`
      );
      return null;
    }

    // Criar o registro de status history
    const statusHistory = await db.status_history.create({
      data: {
        entity_type: entityType,
        entity_id: entityId,
        old_status: oldStatus,
        new_status: newStatus,
        changed_by_id: changedById,
        reason,
        metadata,
        changed_at: new Date(),
      },
    });

    return statusHistory;
  }

  /**
   * Registra múltiplas mudanças de status em transação
   * @param {Array} changes - Array de mudanças [{entityType, entityId, oldStatus, newStatus, reason, metadata}]
   * @returns {Promise<Array>} Registros criados
   */
  static async recordMultipleStatusChanges(changes) {
    const results = [];

    for (const change of changes) {
      const result = await this.recordStatusChange(
        change.entityType,
        change.entityId,
        change.oldStatus,
        change.newStatus,
        change.reason,
        change.metadata
      );
      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Obtém o histórico de status de uma entidade
   * @param {string} entityType - Tipo de entidade
   * @param {string} entityId - ID da entidade
   * @returns {Promise<Array>} Histórico de status
   */
  static async getEntityHistory(entityType, entityId) {
    const history = await db.status_history.findMany({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
      orderBy: {
        changed_at: "desc",
      },
    });

    return history;
  }

  /**
   * Obtém o status atual de uma entidade baseado no histórico
   * @param {string} entityType - Tipo de entidade
   * @param {string} entityId - ID da entidade
   * @returns {Promise<string|null>} Status atual ou null se não houver histórico
   */
  static async getCurrentStatus(entityType, entityId) {
    const lastChange = await db.status_history.findFirst({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
      orderBy: {
        changed_at: "desc",
      },
      select: {
        new_status: true,
      },
    });

    return lastChange?.new_status || null;
  }

  /**
   * Valida se uma transição de status é permitida
   * @param {string} entityType - Tipo de entidade
   * @param {string} oldStatus - Status anterior
   * @param {string} newStatus - Novo status
   * @returns {boolean} True se a transição é válida
   */
  static isValidStatusTransition(entityType, oldStatus, newStatus) {
    // Definir transições válidas por tipo de entidade
    const validTransitions = {
      DONATION: {
        PENDING: ["CONFIRMED", "FAILED", "CANCELLED"],
        CONFIRMED: ["REFUNDED"],
        FAILED: ["CANCELLED"],
        CANCELLED: [],
        REFUNDED: [],
      },
      EXPENSE: {
        PENDING: ["APPROVED", "REJECTED"],
        APPROVED: ["PAID", "CANCELLED"],
        REJECTED: [],
        PAID: [],
        CANCELLED: [],
      },
      PROJECT: {
        DRAFT: ["ACTIVE", "ARCHIVED"],
        ACTIVE: ["PAUSED", "COMPLETED", "ARCHIVED"],
        PAUSED: ["ACTIVE", "ARCHIVED"],
        COMPLETED: ["ARCHIVED"],
        ARCHIVED: [],
      },
      ALLOCATION: {
        PENDING: ["CONFIRMED", "REJECTED"],
        CONFIRMED: ["COMPLETED", "CANCELLED"],
        REJECTED: [],
        COMPLETED: [],
        CANCELLED: [],
      },
      VOLUNTEER_LOG: {
        PENDING: ["APPROVED", "REJECTED"],
        APPROVED: [],
        REJECTED: [],
      },
    };

    const transitions = validTransitions[entityType];
    if (!transitions) {
      console.warn(`Tipo de entidade desconhecido: ${entityType}`);
      return true; // Permitir por padrão se o tipo não for definido
    }

    const allowedTransitions = transitions[oldStatus];
    if (!allowedTransitions) {
      return false;
    }

    return allowedTransitions.includes(newStatus);
  }

  /**
   * Obtém estatísticas de status para um tipo de entidade
   * @param {string} entityType - Tipo de entidade
   * @param {Object} filters - Filtros adicionais (startDate, endDate, etc.)
   * @returns {Promise<Object>} Estatísticas
   */
  static async getStatusStatistics(entityType, filters = {}) {
    const where = { entity_type: entityType };

    if (filters.startDate || filters.endDate) {
      where.changed_at = {};
      if (filters.startDate) {
        where.changed_at.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.changed_at.lte = new Date(filters.endDate);
      }
    }

    const [totalChanges, byStatus, byReason] = await Promise.all([
      db.status_history.count({ where }),
      db.status_history.groupBy({
        by: ["new_status"],
        where,
        _count: true,
      }),
      db.status_history.groupBy({
        by: ["reason"],
        where,
        _count: true,
      }),
    ]);

    return {
      entityType,
      totalChanges,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.new_status] = item._count;
        return acc;
      }, {}),
      byReason: byReason.reduce((acc, item) => {
        if (item.reason) {
          acc[item.reason] = item._count;
        }
        return acc;
      }, {}),
    };
  }

  /**
   * Obtém todas as mudanças de status com filtros
   * @param {Object} filters - Filtros (entityType, entityId, newStatus, startDate, endDate)
   * @returns {Promise<Array>} Mudanças de status
   */
  static async listStatusChanges(filters = {}) {
    const where = {};

    if (filters.entityType) {
      where.entity_type = filters.entityType;
    }

    if (filters.entityId) {
      where.entity_id = filters.entityId;
    }

    if (filters.newStatus) {
      where.new_status = filters.newStatus;
    }

    if (filters.startDate || filters.endDate) {
      where.changed_at = {};
      if (filters.startDate) {
        where.changed_at.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.changed_at.lte = new Date(filters.endDate);
      }
    }

    const changes = await db.status_history.findMany({
      where,
      orderBy: {
        changed_at: "desc",
      },
    });

    return changes;
  }
}

module.exports = StatusHistoryService;
