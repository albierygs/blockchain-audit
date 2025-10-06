require("express-async-errors");
const app = require("./app");
const { PORT } = require("./src/utils/constants");

app.listen(PORT, async () => {
  console.log(`server running on http://localhost:${PORT}/api`);
});

process.on("SIGINT", () => {});
process.on("SIGTERM", () => {});
