const { db } = require("../utils/db");

/**
 * Serviço de Projeto
 *
 * Fornece métodos para gerenciar projetos, incluindo:
 * - Cálculo de valor coletado
 * - Atualização de collected_amount
 * - Rastreamento de alocações por projeto
 */

class ProjectService {
  /**
   * Calcula o valor total coletado para um projeto
   * @param {string} projectId - ID do projeto
   * @returns {Promise<number>} Valor total coletado
   */
  static async getTotalCollectedAmount(projectId) {
    const result = await db.allocation.aggregate({
      where: {
        project_id: projectId,
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
   * Atualiza o campo collected_amount de um projeto
   * @param {string} projectId - ID do projeto
   * @returns {Promise<Object>} Projeto atualizado
   */
  static async updateCollectedAmount(projectId) {
    // Calcular valor total coletado
    const totalCollected = await this.getTotalCollectedAmount(projectId);

    // Atualizar o projeto
    const updatedProject = await db.project.update({
      where: {
        public_id: projectId,
      },
      data: {
        collected_amount: totalCollected,
      },
      select: {
        public_id: true,
        title: true,
        collected_amount: true,
        status: true,
      },
    });

    return updatedProject;
  }

  /**
   * Obtém informações de coleta de um projeto
   * @param {string} projectId - ID do projeto
   * @returns {Promise<Object>} Informações de coleta
   */
  static async getCollectionInfo(projectId) {
    const project = await db.project.findUnique({
      where: {
        public_id: projectId,
      },
      select: {
        public_id: true,
        title: true,
        collected_amount: true,
        goal_amount: true,
        status: true,
      },
    });

    if (!project) {
      throw new Error("Projeto não encontrado");
    }

    const goal_amount = parseFloat(project.goal_amount);
    const collectedAmount = parseFloat(project.collected_amount || 0);
    const remainingAmount = goal_amount - collectedAmount;
    const collectionPercentage = (
      (collectedAmount / goal_amount) *
      100
    ).toFixed(2);

    const allocations = await db.allocation.findMany({
      where: {
        project_id: projectId,
      },
      select: {
        public_id: true,
        amount_allocated: true,
        allocation_date: true,
        donation: {
          select: {
            public_id: true,
            value: true,
            donor: {
              select: {
                person: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        allocation_date: "desc",
      },
    });

    return {
      project: {
        public_id: project.public_id,
        title: project.title,
        status: project.status,
      },
      collection_summary: {
        goal_amount: goal_amount,
        collected_amount: collectedAmount,
        remaining_amount: remainingAmount,
        collection_percentage: collectionPercentage + "%",
      },
      allocations,
    };
  }

  /**
   * Obtém o percentual de coleta de um projeto
   * @param {string} projectId - ID do projeto
   * @returns {Promise<number>} Percentual (0-100)
   */
  static async getCollectionPercentage(projectId) {
    const project = await db.project.findUnique({
      where: {
        public_id: projectId,
      },
      select: {
        goal_amount: true,
        collected_amount: true,
      },
    });

    if (!project) {
      throw new Error("Projeto não encontrado");
    }

    const goal_amount = parseFloat(project.goal_amount);
    const collectedAmount = parseFloat(project.collected_amount || 0);
    const percentage = (collectedAmount / goal_amount) * 100;

    return Math.min(percentage, 100); // Garantir que não ultrapasse 100%
  }

  /**
   * Verifica se um projeto atingiu sua meta de coleta
   * @param {string} projectId - ID do projeto
   * @returns {Promise<boolean>} True se atingiu a meta
   */
  static async hasReachedGoal(projectId) {
    const project = await db.project.findUnique({
      where: {
        public_id: projectId,
      },
      select: {
        goal_amount: true,
        collected_amount: true,
      },
    });

    if (!project) {
      throw new Error("Projeto não encontrado");
    }

    const goal_amount = parseFloat(project.goal_amount);
    const collectedAmount = parseFloat(project.collected_amount || 0);

    return collectedAmount >= goal_amount;
  }

  /**
   * Obtém todos os projetos com informações de coleta
   * @param {Object} filters - Filtros (status, organizationId, etc.)
   * @returns {Promise<Array>} Lista de projetos com informações de coleta
   */
  static async getProjectsWithCollectionInfo(filters = {}) {
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.organizationId) {
      where.organization_id = filters.organizationId;
    }

    const projects = await db.project.findMany({
      where,
      select: {
        public_id: true,
        title: true,
        goal_amount: true,
        collected_amount: true,
        status: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return projects.map((project) => {
      const goal_amount = parseFloat(project.goal_amount);
      const collectedAmount = parseFloat(project.collected_amount || 0);
      const remainingAmount = goal_amount - collectedAmount;
      const collectionPercentage = (
        (collectedAmount / goal_amount) *
        100
      ).toFixed(2);

      return {
        ...project,
        goal_amount: goal_amount,
        collected_amount: collectedAmount,
        remaining_amount: remainingAmount,
        collection_percentage: collectionPercentage + "%",
      };
    });
  }
}

module.exports = ProjectService;
