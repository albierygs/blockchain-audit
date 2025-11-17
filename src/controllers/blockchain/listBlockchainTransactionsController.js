const BlockchainService = require("../../services/blockchainService");

const listBlockchainTransactions = async (req, res) => {
  const { network, status, type, startDate, endDate } = req.query;

  const filters = {};
  if (network) filters.network = network;
  if (status) filters.status = status.toUpperCase();
  if (type) filters.type = type.toUpperCase();
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const transactions = await BlockchainService.listTransactions(filters);

  res.status(200).json(transactions);
};

module.exports = listBlockchainTransactions;
