const unknownEndpoint = async (req, res) => {
  res.status(404).json({
    error: "Unknown endpoint",
    message: `Route ${req.originalUrl} does not exist`,
    method: req.method,
    apiRoute: "/api",
  });
};

module.exports = unknownEndpoint;
