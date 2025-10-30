require("dotenv").config();

const PORT = Number(process.env.PORT);
const SALT_BCRYPT = Number(process.env.SALT_BCRYPT);
const SECRET_KET_JWT = process.env.SECRET_KET_JWT;
const JWT_EXPIRATION_TIME = Number(process.env.JWT_EXPIRATION_TIME);
const JWT_EXPIRATION_UNIT = process.env.JWT_EXPIRATION_UNIT;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

module.exports = {
  PORT,
  SALT_BCRYPT,
  SECRET_KET_JWT,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  JWT_EXPIRATION_TIME,
  JWT_EXPIRATION_UNIT,
};
