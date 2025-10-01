const app = require("./app");
const { PORT } = require("./src/utils/constants");

app.listen(PORT, async () => {
  console.log(`server running on port ${PORT}`);
});

process.on("SIGINT", () => {});
process.on("SIGTERM", () => {});
