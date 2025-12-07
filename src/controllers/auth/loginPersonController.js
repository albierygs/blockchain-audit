const ApiException = require("../../exceptions/apiException");
const {
  SECRET_KET_JWT,
  JWT_EXPIRATION_TIME,
  JWT_EXPIRATION_UNIT,
} = require("../../utils/constants");
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
    person = await db.person.findFirst({
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
    expiresIn: JWT_EXPIRATION_TIME + JWT_EXPIRATION_UNIT,
  };

  let payload = { publicId: person.public_id, role: person.role };

  if (person.role === "ORG_MEMBER") {
    payload.memberRole = person.organization_member.role;
  }

  const token = jwt.sign(payload, SECRET_KET_JWT, options);

  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + JWT_EXPIRATION_TIME);

  const userAgent = req.headers["user-agent"];
  const userIp = req.ip;

  await db.session.create({
    data: {
      token: token,
      ip_address: userIp,
      user_agent: userAgent,
      expires_at: expirationDate,
      user_id: person.public_id,
    },
  });

  res.status(200).json({
    token,
    type: person.role,
    created_at: new Date().toLocaleString(),
    duration: JWT_EXPIRATION_TIME + JWT_EXPIRATION_UNIT,
  });
};

module.exports = loginPerson;
