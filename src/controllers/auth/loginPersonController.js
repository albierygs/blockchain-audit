const ApiException = require("../../exceptions/apiException");
const { SECRET_KET_JWT } = require("../../utils/constants");
const { db } = require("../../utils/db");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginPerson = async (req, res) => {
  let person;

  if (req.body.email) {
    person = await db.person.findUnique({
      where: {
        email: req.body.email,
        status: "ACTIVE",
      },
      select: {
        public_id: true,
        role: true,
        password: true,
      },
    });
  } else {
    person = await db.person.findUnique({
      where: {
        organization_member: {
          member_code: req.body.memberCode,
        },
        status: "ACTIVE",
        role: "ORG_MEMBER",
      },
      select: {
        public_id: true,
        role: true,
        password: true,
        organization_member: {
          select: {
            role: true,
          },
        },
      },
    });
  }

  if (!person) {
    throw new ApiException("email/password incorrect", 401);
  }

  const correctPassword = await bcryptjs.compare(
    req.body.password,
    person.password
  );

  if (!correctPassword) {
    throw new ApiException("email/password incorrect", 401);
  }

  const options = {
    expiresIn: "10m",
  };

  let payload = { publicId: person.public_id, role: person.role };

  if (person.role === "ORG_MEMBER") {
    payload.memberRole = person.organization_member.role;
  }

  const token = jwt.sign(payload, SECRET_KET_JWT, options);

  res.status(200).json({
    token,
    created_at: new Date().toLocaleString(),
    duration: "10 minutes",
  });
};

module.exports = loginPerson;
