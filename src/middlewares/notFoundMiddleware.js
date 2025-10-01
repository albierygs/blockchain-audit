const unknownEndpoint = async (request, response) => {
  response.status(404).json({
    error: "Unknown endpoint",
    message: `Route ${request.originalUrl} does not exist`,
    method: request.method,
    apiRoute: "/api",
  });
};

module.exports = unknownEndpoint;
