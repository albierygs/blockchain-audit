const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const BlockchainService = require("../../services/blockchainService");

const createDonation = async (req, res) => {
  const { organization_id, value, payment_method } = req.body;
  const donor_id = req.user.publicId;

  // Verificar se o doador existe
  const donor = await db.donor.findUnique({
    where: {
      public_id: donor_id,
    },
  });

  if (!donor) {
    throw new ApiException("Doador não encontrado", 404);
  }

  // Verificar se a organização existe
  const organization = await db.organization.findUnique({
    where: {
      public_id: organization_id,
    },
  });

  if (!organization) {
    throw new ApiException("Organização não encontrada", 404);
  }

  // Criar a nova doação
  const newDonation = await db.donation.create({
    data: {
      donor_id,
      organization_id,
      value: parseFloat(value),
      payment_method,
      status: "CONFIRMED",
    },
    include: {
      donor: {
        select: {
          person: {
            select: {
              name: true,
              public_id: true,
            },
          },
        },
      },
      organization: {
        select: {
          name: true,
          public_id: true,
        },
      },
    },
  });

  try {
    // Registrar automaticamente a transação blockchain
    const blockchainTransaction = await BlockchainService.recordTransaction({
      type: "DONATION",
      network: "ETHEREUM_TESTNET",
      value: parseFloat(value),
      donation_id: newDonation.public_id,
      from_address: donor.public_id,
      to_address: organization.public_id,
    });

    // Retornar a doação com os dados da transação blockchain
    const donationWithBlockchain = {
      ...newDonation,
      blockchain_transaction: {
        public_id: blockchainTransaction.public_id,
        hash: blockchainTransaction.hash,
        status: blockchainTransaction.status,
        network: blockchainTransaction.network,
        block_number: blockchainTransaction.block_number,
        confirmations: blockchainTransaction.confirmations,
        timestamp: blockchainTransaction.timestamp,
      },
    };

    res.status(201).json(donationWithBlockchain);
  } catch (blockchainError) {
    // Se houver erro no blockchain, ainda retornar a doação criada
    // mas com aviso de erro no blockchain
    console.error("Erro ao registrar transação blockchain:", blockchainError);

    const donationWithError = {
      ...newDonation,
      blockchain_error:
        "Falha ao registrar transação blockchain. Tente novamente mais tarde.",
      blockchain_transaction: null,
    };

    res.status(201).json(donationWithError);
  }
};

module.exports = createDonation;
