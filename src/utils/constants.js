require("dotenv").config();

const PORT = process.env.PORT;
const SALT_BCRYPT = process.env.SALT_BCRYPT;
const DONOR_SECRET_KET_JWT = process.env.DONOR_SECRET_KET_JWT;

module.exports = {
  PORT,
  SALT_BCRYPT,
  DONOR_SECRET_KET_JWT,
};
