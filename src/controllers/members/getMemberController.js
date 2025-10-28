const ApiException = require("../../exceptions/apiException");
const { db } = require("../../utils/db");

const getMember = async (req, res) => {
  const person = await db.person.findUnique({
    where: {
      public_id: req.params.id,
      status: "ACTIVE",
      role: "ORG_MEMBER",
    },
    select: {
      public_id: true,
      name: true,
      email: true,
      phone: true,
      document: true,
      created_at: true,
      updated_at: true,
      status: true,
      organization_member: {
        select: {
          member_code: true,
          organization_id: true,
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

  if (!person) {
    throw new ApiException("member not found", 404);
  }

  const response = {
    ...person,
    member_code: person.organization_member.member_code,
    organization_id: person.organization_member.organization_id,
    organization_name: person.organization_member.organization.name,
    role: person.organization_member.role,
    organization_member: undefined,
  };

  res.status(200).json(response);
};

module.exports = getMember;
