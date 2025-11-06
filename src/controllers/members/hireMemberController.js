const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const bcrypt = require("bcryptjs");
const { SALT_BCRYPT } = require("../../utils/constants");
const generateMemberCode = require("../../helpers/createMemberCode");
const { sendMemberHiredEmail } = require("../../utils/emailService");

const hireMember = async (req, res) => {
  const {
    name,
    email,
    phone,
    document,
    role,
    organizationId,
    city,
    state,
    birthDate,
  } = req.body;

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

  const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
  const passwordHash = await bcrypt.hash(tempPassword, SALT_BCRYPT);

  const result = await db.$transaction(async (tx) => {
    if (!person) {
      person = await tx.person.create({
        data: {
          document,
          email,
          name,
          password: passwordHash,
          phone,
          city,
          state,
          birth_date: birthDate,
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

    let memberCode = null;

    if (!member) {
      memberCode = await generateMemberCode();
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
      memberCode = member.member_code;
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

    await sendMemberHiredEmail(
      person.name,
      person.email,
      memberCode,
      tempPassword
    );

    return { person, member, membership };
  });

  res.status(200).json(result);
};

module.exports = hireMember;
