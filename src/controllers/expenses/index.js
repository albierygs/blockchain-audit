const createExpense = require("./createExpenseController");
const getExpense = require("./getExpenseController");
const updateExpense = require("./updateExpenseController");
const deleteExpense = require("./deleteExpenseController");
const listExpenses = require("./listExpensesController");
const approveExpense = require("./approveExpenseController");

module.exports = {
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
  listExpenses,
  approveExpense,
};
