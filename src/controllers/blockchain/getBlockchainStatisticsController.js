const BlockchainService = require("../../services/blockchainService");

const getBlockchainStatistics = async (req, res) => {
  const statistics = await BlockchainService.getStatistics();
  res.status(200).json(statistics);
};

module.exports = getBlockchainStatistics;
