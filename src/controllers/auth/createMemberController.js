const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const bcrypt = require("bcryptjs");
const { SALT_BCRYPT } = require("../../utils/constants");
const generateMemberCode = require("../../helpers/createMemberCode");

const createMember = async (req, res) => {
  const { name, email, phone, document, password, role, organizationId } =
    req.body;

  const person = await db.person.findFirst({
    where: {
      OR: [{ email }, { document }],
      role: "ORG_MEMBER",
    },
  });

  if (person) {
    throw new ApiException("email/document already been used", 409);
  }

  const organizationExists = await db.organization.findUnique({
    where: {
      public_id: organizationId,
      status: "ACTIVE",
    },
  });

  if (organizationExists) {
    throw new ApiException("organizationId not exists", 422);
  }

  const passwordHash = await bcrypt.hash(password, Number(SALT_BCRYPT));

  const memberCode = await generateMemberCode();

  const personCreated = await db.person.create({
    data: {
      document,
      email,
      name,
      password: passwordHash,
      phone,
      status: "ACTIVE",
      organization_member: {
        create: {
          role,
          organization_id: organizationId,
          member_code: memberCode,
        },
      },
    },
    select: {
      public_id: true,
      name: true,
      email: true,
      phone: true,
      document: true,
      created_at: true,
      organization_member: {
        select: {
          organization_id: true,
          member_code: true,
          role: true,
          organization: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const response = {
    ...personCreated,
    role: personCreated.organization_member.role,
    organization_name: personCreated.organization_member.organization.name,
    member_code: personCreated.organization_member.member_code,
    organization_id: personCreated.organization_member.organization_id,
    organization_member: undefined,
  };

  res.status(200).json(response);
};

module.exports = createMember;
