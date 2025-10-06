const errorHandler = require("./errorHandlerMiddleware");
const unknownEndpoint = require("./notFoundMiddleware");
const validateParam = require("./paramValidatorMiddleware");
const validateToken = require("./tokenValidatorMiddleware");
const validateReqBodyCreateDonor = require("./validators/reqBodyCreateDonorValidator");
const validateReqBodyLoginDonor = require("./validators/reqBodyLoginDonorValidator");
const validateReqBodyUpdateDonor = require("./validators/reqBodyUpdateDonorValidator");

module.exports = {
  errorHandler,
  unknownEndpoint,
  validateReqBodyCreateDonor,
  validateReqBodyLoginDonor,
  validateReqBodyUpdateDonor,
  validateToken,
  validateParam,
};
