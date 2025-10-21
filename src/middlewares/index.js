const errorHandler = require("./errorHandlerMiddleware");
const unknownEndpoint = require("./notFoundMiddleware");
const validateParamId = require("./paramIdValidatorMiddleware");
const validateToken = require("./tokenValidatorMiddleware");
const validateReqBody = require("./requestBodyValidatorMiddleware");
const authorizeRoles = require("./authorizeRolesMiddleware");

module.exports = {
  errorHandler,
  unknownEndpoint,
  validateReqBody,
  validateToken,
  validateParamId,
  authorizeRoles,
};
