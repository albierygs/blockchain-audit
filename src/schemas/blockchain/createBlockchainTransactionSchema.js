const { z } = require("zod");

const createBlockchainTransactionSchema = z
  .object({
    hash: z
      .string("invalid hash type")
      .min(1, "hash can not be empty")
      .max(255, "hash max length is 255")
      .optional(),
    type: z
      .enum(["DONATION", "ALLOCATION"], {
        errorMap: () => ({
          message: "invalid transaction type. Use: DONATION or ALLOCATION",
        }),
      })
      .nonoptional("type is required"),
    block_number: z
      .number("invalid block_number type")
      .int("block_number must be an integer")
      .positive("block_number must be positive")
      .optional(),
    network: z
      .string()
      .min(1, "network can not be empty")
      .max(50, "network max length is 50")
      .nonoptional("network required"),
    timestamp: z.iso.datetime().optional(),
    value: z
      .number("invalid value type")
      .positive("value must be positive")
      .refine(
        (val) =>
          Number(val.toFixed(2)) === val ||
          val.toString().split(".")[1]?.length <= 2,
        { message: "value can have a maximum of 2 decimal places" }
      ),
    gas_used: z
      .number("invalid gas_used type")
      .positive("gas_used must be positive")
      .optional(),
    gas_price: z
      .number("invalid gas_price type")
      .positive("gas_price must be positive")
      .optional(),
    from_address: z
      .string("invalid from_address type")
      .max(255, "from_address max length is 255")
      .optional(),
    to_address: z
      .string("invalid to_address type")
      .max(255, "to_address max length is 255")
      .optional(),
    status: z
      .enum(["PENDING", "CONFIRMED", "FAILED"], {
        errorMap: () => ({
          message: "invalid status. Use: PENDING, CONFIRMED or FAILED",
        }),
      })
      .optional(),
    donation_id: z.uuid("donation_id must be a UUID").optional(),
    allocation_id: z.uuid("allocation_id must be a UUID").optional(),
  })
  .strict();

module.exports = createBlockchainTransactionSchema;
