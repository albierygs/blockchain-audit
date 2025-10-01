const helloRouteHandler = async (request, response) => {
  response.json({
    name: "Blockchain Audit API",
    status: "online",
    dateTime: new Date().toLocaleString(),
    ip: request.ip,
    endpoints: {},
  });
};

module.exports = helloRouteHandler;
