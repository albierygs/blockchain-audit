const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const getAllocation = async (req, res) => {
  const { allocationId } = req.params;

  const allocation = await db.allocation.findUnique({
    where: {
      public_id: allocationId,
    },
    include: {
      donation: {
        select: {
          public_id: true,
          value: true,
          status: true,
          payment_method: true,
          date: true,
          donor: {
            select: {
              person: {
                select: {
                  name: true,
                  public_id: true,
                  email: true,
                },
              },
            },
          },
        },
      },
      project: {
        select: {
          public_id: true,
          title: true,
          description: true,
          status: true,
        },
      },
      organization: {
        select: {
          public_id: true,
          name: true,
          email: true,
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
    },
  });

  if (!allocation) {
    throw new ApiException("Alocação não encontrada", 404);
  }

  res.status(200).json(allocation);
};

module.exports = getAllocation;
