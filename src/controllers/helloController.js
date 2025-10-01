const helloRouteHandler = async (request, response) => {
  response.json({
    name: "Blockchain Auditory API",
    status: "online",
    dateTime: new Date().toLocaleString(),
    ip: request.ip,
    endpoints: {},
  });
};

module.exports = helloRouteHandler;
