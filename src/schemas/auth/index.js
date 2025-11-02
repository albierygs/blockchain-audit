const createDonorSchema = require("./createDonorSchema");
const createAdminSchema = require("./createAdminSchema");
const loginSchema = require("./loginSchema");
const resetPasswordSchema = require("./passwordReset/resetPasswordSchema");
const forgotPasswordSchema = require("./passwordReset/forgotPasswordSchema");

module.exports = {
  createDonorSchema,
  loginSchema,
  createAdminSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
};
