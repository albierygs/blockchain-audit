const createProject = require("./createProjectController");
const getProject = require("./getProjectController");
const updateProject = require("./updateProjectController");
const deleteProject = require("./deleteProjectController");
const listProjects = require("./listProjectsController");

module.exports = {
  createProject,
  getProject,
  updateProject,
  deleteProject,
  listProjects,
};
