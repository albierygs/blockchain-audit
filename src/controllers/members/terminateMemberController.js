const { db } = require("../../utils/db");
const { sendMemberTerminationEmail } = require("../../utils/emailService");
const StatusHistoryService = require("../../services/statusHistoryService");

const terminateMember = async (req, res) => {
  const { reason } = req.body;
  const changedByPublicId = req.user.publicId;
  const oldStatus = "ACTIVE";
  const newStatus = "TERMINATED";

  let memberToTerminate;
  let organizationName;
  let membershipPublicId;

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
      select: {
        id: true,
        member_id: true,
        public_id: true,
        organization: { select: { name: true } },
      },
    });

    if (!membership) {
      throw new ApiException("Active membership not found", 404);
    }

    organizationName = membership.organization.name;
    membershipPublicId = membership.public_id;

    memberToTerminate = await tx.person.findUnique({
      where: { public_id: membership.member_id },
      select: { name: true, email: true },
    });

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
      where: { public_id: req.params.id },
      data: {
        organization_id: null,
        role: null,
        status: "TERMINATED",
      },
    });
  });

  // Registrar histórico de status da MEMBERSHIP
  try {
    await StatusHistoryService.recordStatusChange(
      "MEMBERSHIP",
      membershipPublicId, // ID da membership
      oldStatus,
      newStatus,
      changedByPublicId,
      `Membro desligado da organização ${organizationName}. Motivo: ${reason}`,
      {
        termination_reason: reason,
        organization_name: organizationName,
      }
    );
  } catch (statusError) {
    console.error(
      "Erro ao registrar status history em terminateMember:",
      statusError
    );
  }

  if (memberToTerminate && organizationName) {
    await sendMemberTerminationEmail(
      memberToTerminate.name,
      memberToTerminate.email,
      organizationName,
      reason
    );
  }
  res.status(204).send();
};

module.exports = terminateMember;
