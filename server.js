require("express-async-errors");
const app = require("./app");
const seedAdmin = require("./src/helpers/seedAdmin");
const { PORT } = require("./src/utils/constants");

app.listen(PORT, async () => {
  await seedAdmin();
  console.log(`server running on http://localhost:${PORT}/api`);
});
