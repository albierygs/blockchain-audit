const { default: z } = require("zod");

const terminateMemberSchema = z.object({
  reason: z.string("invalid reason").min(5, "too small reason"),
});

module.exports = terminateMemberSchema;
