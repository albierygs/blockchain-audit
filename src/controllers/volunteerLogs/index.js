const listVolunteerLogs = require("./listVolunteerLogsController");
const getVolunteerLog = require("./getVolunteerLogController");
const createVolunteerLog = require("./createVolunteerLogController");
const approveVolunteerLog = require("./approveVolunteerLogController");
const rejectVolunteerLog = require("./rejectVolunteerLogController");

module.exports = {
  listVolunteerLogs,
  getVolunteerLog,
  createVolunteerLog,
  approveVolunteerLog,
  rejectVolunteerLog,
};
