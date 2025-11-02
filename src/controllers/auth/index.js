const loginPerson = require("./loginPersonController");
const createDonor = require("./createDonorController");
const createAdmin = require("./createAdminController");
const logoutPerson = require("./logoutPersonController");
const forgotPassword = require("./forgotPasswordController");
const resetPassword = require("./resetPasswordController");

module.exports = {
  loginPerson,
  logoutPerson,
  createDonor,
  createAdmin,
  forgotPassword,
  resetPassword,
};
