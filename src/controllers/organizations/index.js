const createOrganization = require("./createOrganizationController");
const deleteOrganization = require("./deleteOrganizationController");
const getOrganization = require("./getOrganizationController");
const listAllOrganizations = require("./listAllOrganizationsController");
const listVerifiedOrganizations = require("./listVerifiedOrganizations");
const updateOrganization = require("./updateOrganizationController");
const verifyOrganization = require("./verifyOrganizationController");

module.exports = {
  createOrganization,
  getOrganization,
  listAllOrganizations,
  listVerifiedOrganizations,
  updateOrganization,
  deleteOrganization,
  verifyOrganization,
};
