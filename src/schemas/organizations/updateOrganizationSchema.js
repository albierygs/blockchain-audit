const { z } = require("zod");
const createOrganizationSchema = require("./createOrganizationSchema");

const updateOrganizationSchema = createOrganizationSchema.partial();

module.exports = updateOrganizationSchema;
