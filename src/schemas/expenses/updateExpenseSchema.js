const { z } = require("zod");
const createExpenseSchema = require("./createExpenseSchema");

const updateExpenseSchema = createExpenseSchema
  .extend({
    status: z
      .enum(["PENDING", "APPROVED", "PAID", "REJECTED", "CANCELLED"], {
        error: "invalid expense status",
      })
      .optional(),
  })
  .partial();

module.exports = updateExpenseSchema;
