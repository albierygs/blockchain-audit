const loginPerson = require("./loginPersonController");
const createDonor = require("./createDonorController");
const createAdmin = require("./createAdminController");
const logoutPerson = require("./logoutPersonController");

module.exports = {
  loginPerson,
  logoutPerson,
  createDonor,
  createAdmin,
};
