const BlockchainService = require("../../services/blockchainService");
const ApiException = require("../../exceptions/apiException");

const getBlockchainTransaction = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await BlockchainService.getTransaction(transactionId);
    res.status(200).json(transaction);
  } catch (error) {
    throw new ApiException("Transação blockchain não encontrada", 404);
  }
};

module.exports = getBlockchainTransaction;
