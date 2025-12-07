const listVolunteerLogs = require("./listVolunteerLogsController");
const getVolunteerLog = require("./getVolunteerLogController");
const createVolunteerLog = require("./createVolunteerLogController");
const approveVolunteerLog = require("./approveVolunteerLogController");
const rejectVolunteerLog = require("./rejectVolunteerLogController");
const listAllVolunteerLogs = require("./listAllVolunteerLogsController");

module.exports = {
  listVolunteerLogs,
  getVolunteerLog,
  createVolunteerLog,
  approveVolunteerLog,
  rejectVolunteerLog,
  listAllVolunteerLogs,
};
