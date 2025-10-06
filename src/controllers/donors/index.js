const createDonor = require("./createDonorController");
const deleteDonor = require("./deleteDonorController");
const getDonor = require("./getDonorController");
const loginDonor = require("./loginDonorController");
const updateDonor = require("./updateDonorController");

module.exports = {
  createDonor,
  loginDonor,
  deleteDonor,
  getDonor,
  updateDonor,
};
