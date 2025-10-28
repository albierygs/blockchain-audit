const { Router } = require("express");
const {
  validateToken,
  authorizeRoles,
  validateParamId,
  validateReqBody,
} = require("../middlewares");
const {
  createProjectSchema,
  updateProjectSchema,
} = require("../schemas/projects");
const {
  createProject,
  getProject,
  updateProject,
  deleteProject,
  listProjects,
} = require("../controllers/projects");

const projectsRoutes = Router({ mergeParams: true }); // Habilita o merge de params

// Rotas aninhadas (/organizations/:id/projects)

// CRIAR um novo projeto para uma organização
projectsRoutes.post(
  "/",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN"]),
  validateParamId("MEMBER_TO_ORGANIZATION"), // :id é o organizationId
  validateReqBody(createProjectSchema),
  createProject
);

// LISTAR projetos de uma organização
projectsRoutes.get(
  "/",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER", "DONOR"]),
  validateParamId("MEMBER_TO_ORGANIZATION"), // :id é o organizationId
  listProjects
);

// Rotas diretas (/projects/:id) - Requer um roteador separado
const singleProjectRoutes = Router();

// OBTER um projeto específico
singleProjectRoutes.get(
  "/:id",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER", "DONOR"]),
  validateParamId("ORG_PROJECT_ACCESS"),
  getProject
);

// ATUALIZAR um projeto
singleProjectRoutes.put(
  "/:id",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN"]),
  validateParamId("ORG_PROJECT_ACTION"),
  validateReqBody(updateProjectSchema),
  updateProject
);

// DELETAR um projeto (Soft Delete)
singleProjectRoutes.delete(
  "/:id",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN"]),
  validateParamId("ORG_PROJECT_ACTION"),
  deleteProject
);

module.exports = { projectsRoutes, singleProjectRoutes };
