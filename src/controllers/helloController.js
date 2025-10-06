const helloRouteHandler = async (req, res) => {
  res.json({
    name: "Blockchain Audit API",
    status: "online",
    dateTime: new Date().toLocaleString(),
    ip: req.ip,
    endpoints: {
      donors: "/api/donors",
    },
  });
};

module.exports = helloRouteHandler;
