require("dotenv").config();

const PORT = process.env.PORT;
const SALT_BCRYPT = process.env.SALT_BCRYPT;
const SECRET_KET_JWT = process.env.SECRET_KET_JWT;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

module.exports = {
  PORT,
  SALT_BCRYPT,
  SECRET_KET_JWT,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
};
