const { db } = require("../../utils/db");

const terminateMember = async (req, res) => {
  const { reason } = req.body;

  await db.$transaction(async (tx) => {
    const member = await tx.organization_member.findUnique({
      where: {
        public_id: req.user.publicId,
        status: "ACTIVE",
      },
      select: {
        organization_id: true,
        public_id: true,
      },
    });

    const membership = await tx.organization_membership.findFirst({
      where: {
        member_id: req.params.id,
        organization_id: member.organization_id,
        status: "ACTIVE",
      },
    });

    if (!membership) {
      throw new ApiException("Active membership not found", 404);
    }

    await tx.organization_membership.update({
      where: { id: membership.id },
      data: {
        status: "TERMINATED",
        terminated_at: new Date(),
        terminated_by_id: req.user.publicId,
        termination_reason: reason,
      },
    });

    await tx.organization_member.update({
      where: { public_id: member.public_id },
      data: {
        organization_id: null,
        role: null,
        status: "TERMINATED",
      },
    });
  });

  res.status(204).send();
};

module.exports = terminateMember;
