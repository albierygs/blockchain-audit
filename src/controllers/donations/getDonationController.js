const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const getDonation = async (req, res) => {
  const { donationId } = req.params;

  const donation = await db.donation.findUnique({
    where: {
      public_id: donationId,
    },
    include: {
      donor: {
        select: {
          person: {
            select: {
              name: true,
              public_id: true,
              email: true,
              phone: true,
            },
          },
          document_type: true,
        },
      },
      organization: {
        select: {
          name: true,
          public_id: true,
          email: true,
          phone: true,
          cnpj: true,
        },
      },
      blockchain_transaction: {
        select: {
          public_id: true,
          hash: true,
          status: true,
          network: true,
          block_number: true,
          confirmations: true,
          timestamp: true,
        },
      },
      allocations: {
        select: {
          public_id: true,
          amount_allocated: true,
          project: {
            select: {
              title: true,
              public_id: true,
            },
          },
        },
      },
    },
  });

  if (!donation) {
    throw new ApiException("Doação não encontrada", 404);
  }

  res.status(200).json(donation);
};

module.exports = getDonation;
