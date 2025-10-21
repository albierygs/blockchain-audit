const {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  SALT_BCRYPT,
} = require("../utils/constants");
const { db } = require("../utils/db");
const bcryptjs = require("bcryptjs");

const seedAdmin = async () => {
  const existingAdmin = await db.person.findUnique({
    where: {
      role: "ADMIN",
      email: ADMIN_EMAIL,
    },
  });

  if (!existingAdmin) {
    await db.person.create({
      data: {
        name: "Administrator",
        email: ADMIN_EMAIL,
        password: await bcryptjs.hash(ADMIN_PASSWORD, Number(SALT_BCRYPT)),
        role: "ADMIN",
        status: "ACTIVE",
        document: "00000000000",
        phone: "00000000000",
      },
    });
    console.info("Admin user seeded");
  }
};

module.exports = seedAdmin;
