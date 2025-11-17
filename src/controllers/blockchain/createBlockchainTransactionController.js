const BlockchainService = require("../../services/blockchainService");
const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const createBlockchainTransaction = async (req, res) => {
  const {
    type,
    network,
    value,
    donation_id,
    allocation_id,
    from_address,
    to_address,
    gas_used,
    gas_price,
  } = req.body;

  // Validar que pelo menos donation_id ou allocation_id está presente
  if (!donation_id && !allocation_id) {
    throw new ApiException(
      "Pelo menos donation_id ou allocation_id é obrigatório",
      400
    );
  }

  // Validar donation_id se fornecido
  if (donation_id) {
    const donation = await db.donation.findUnique({
      where: { public_id: donation_id },
    });
    if (!donation) {
      throw new ApiException("Doação não encontrada", 404);
    }
  }

  // Validar allocation_id se fornecido
  if (allocation_id) {
    const allocation = await db.allocation.findUnique({
      where: { public_id: allocation_id },
    });
    if (!allocation) {
      throw new ApiException("Alocação não encontrada", 404);
    }
  }

  // Registrar a transação usando o serviço blockchain
  const transaction = await BlockchainService.recordTransaction({
    type,
    network,
    value,
    donation_id,
    allocation_id,
    from_address,
    to_address,
    gas_used,
    gas_price,
  });

  res.status(201).json(transaction);
};

module.exports = createBlockchainTransaction;
