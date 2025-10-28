const getMember = require("./getMemberController");
const getMemberHistory = require("./getMemberHistoryController");
const hireMember = require("./hireMemberController");
const terminateMember = require("./terminateMemberController");

module.exports = {
  getMember,
  getMemberHistory,
  hireMember,
  terminateMember,
};
