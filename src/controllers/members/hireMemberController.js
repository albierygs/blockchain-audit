const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const bcrypt = require("bcryptjs");
const { SALT_BCRYPT } = require("../../utils/constants");
const generateMemberCode = require("../../helpers/createMemberCode");

const hireMember = async (req, res) => {
  const { name, email, phone, document, password, role, organizationId } =
    req.body;

  const org = await db.organization.findUnique({
    where: {
      public_id: organizationId,
      status: "ACTIVE",
    },
  });

  if (!org) {
    throw new ApiException("Organization id not exists", 404);
  }

  let person = await db.person.findFirst({
    where: {
      OR: [{ email }, { document }],
    },
    select: {
      name: true,
      public_id: true,
      email: true,
      document: true,
      phone: true,
      role: true,
      status: true,
      created_at: true,
      organization_member: {
        select: {
          memberships: {
            where: {
              organization_id: organizationId,
              status: "ACTIVE",
            },
          },
        },
      },
    },
  });

  if (person && person?.organization_member?.memberships?.length > 0) {
    throw new ApiException("Member already active in this organization", 409);
  }

  const passwordHash = await bcrypt.hash(password, Number(SALT_BCRYPT));

  const result = await db.$transaction(async (tx) => {
    if (!person) {
      person = await tx.person.create({
        data: {
          document,
          email,
          name,
          password: passwordHash,
          phone,
          role: "ORG_MEMBER",
        },
        omit: {
          password: true,
          deleted_at: true,
          updated_at: true,
          id: true,
        },
      });
    }

    let member = await tx.organization_member.findUnique({
      where: { public_id: person.public_id },
    });

    if (!member) {
      const memberCode = await generateMemberCode();
      member = await tx.organization_member.create({
        data: {
          public_id: person.public_id,
          member_code: memberCode,
          role: role,
          organization_id: organizationId,
          status: "ACTIVE",
        },
        select: {
          public_id: true,
          member_code: true,
          organization_id: true,
          role: true,
          status: true,
          created_at: true,
        },
      });
    } else {
      member = await tx.organization_member.update({
        where: { public_id: person.public_id },
        data: {
          role: role,
          organization_id: organizationId,
          status: "ACTIVE",
        },
        select: {
          public_id: true,
          member_code: true,
          organization_id: true,
          role: true,
          status: true,
          created_at: true,
        },
      });
    }

    const membership = await tx.organization_membership.create({
      data: {
        member_id: person.public_id,
        organization_id: organizationId,
        role: role,
        status: "ACTIVE",
        hired_by_id: req.user.publicId,
      },
      select: {
        public_id: true,
        member_id: true,
        hired_by_id: true,
        hired_at: true,
        organization_id: true,
        role: true,
        status: true,
      },
    });

    return { person, member, membership };
  });

  res.status(200).json(result);
};

module.exports = hireMember;
