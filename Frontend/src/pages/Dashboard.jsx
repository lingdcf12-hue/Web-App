import { useState } from "react";
import SummaryCard from "../components/SummaryCard";
import Charts from "../components/Charts";
import { formatCurrency } from "../utils/formatCurrency";

export default function Dashboard({ transactions, theme }) {
  const [period, setPeriod] = useState("monthly");

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Helper function to get previous period dates
  const getPreviousPeriodDates = (periodType) => {
    const prevDate = new Date(now);
    switch (periodType) {
      case "daily":
        prevDate.setDate(currentDay - 1);
        return {
          day: prevDate.getDate(),
          month: prevDate.getMonth(),
          year: prevDate.getFullYear(),
        };
      case "monthly":
        prevDate.setMonth(currentMonth - 1);
        return { month: prevDate.getMonth(), year: prevDate.getFullYear() };
      case "yearly":
        prevDate.setFullYear(currentYear - 1);
        return { year: prevDate.getFullYear() };
      default:
        return {};
    }
  };

  // Filter transactions by period
  const getFilteredTransactions = (periodType, isPrevious = false) => {
    const targetDate = isPrevious
      ? getPreviousPeriodDates(periodType)
      : { day: currentDay, month: currentMonth, year: currentYear };

    return transactions.filter((t) => {
      const date = new Date(t.date);
      switch (periodType) {
        case "daily":
          return (
            date.getDate() === targetDate.day &&
            date.getMonth() === targetDate.month &&
            date.getFullYear() === targetDate.year
          );
        case "monthly":
          return (
            date.getMonth() === targetDate.month &&
            date.getFullYear() === targetDate.year
          );
        case "yearly":
          return date.getFullYear() === targetDate.year;
        default:
          return true;
      }
    });
  };

  const currentPeriodTransactions = getFilteredTransactions(period);
  const previousPeriodTransactions = getFilteredTransactions(period, true);

  const currentIncome = currentPeriodTransactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);
  const currentExpense = currentPeriodTransactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const previousIncome = previousPeriodTransactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);
  const previousExpense = previousPeriodTransactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const incomeChange =
    previousIncome > 0
      ? ((currentIncome - previousIncome) / previousIncome) * 100
      : 0;
  const expenseChange =
    previousExpense > 0
      ? ((currentExpense - previousExpense) / previousExpense) * 100
      : 0;

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const displayIncome = currentIncome;
  const displayExpense = currentExpense;

  return (
    <div className="py-8 space-y-8">
      <div className="text-center">
        <h1
          className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Financial Dashboard
        </h1>
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Monitor your income and expenses
        </p>
      </div>

      <div className="flex justify-center">
        <div
          className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl p-1 shadow-sm`}
        >
          <button
            onClick={() => setPeriod("daily")}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              period === "daily"
                ? "bg-emerald-600 text-white shadow-lg"
                : theme === "dark"
                  ? "text-gray-300 hover:text-emerald-400"
                  : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              period === "monthly"
                ? "bg-emerald-600 text-white shadow-lg"
                : theme === "dark"
                  ? "text-gray-300 hover:text-emerald-400"
                  : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod("yearly")}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              period === "yearly"
                ? "bg-emerald-600 text-white shadow-lg"
                : theme === "dark"
                  ? "text-gray-300 hover:text-emerald-400"
                  : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            This Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Income"
          value={displayIncome}
          color="green"
          change={incomeChange}
          theme={theme}
        />
        <SummaryCard
          title="Total Expense"
          value={displayExpense}
          color="red"
          change={expenseChange}
          theme={theme}
        />
        <SummaryCard
          title="Net Balance"
          value={displayIncome - displayExpense}
          change={null}
          theme={theme}
        />
      </div>

      <div
        className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 shadow-sm`}
      >
        <h2
          className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          {period === "daily"
            ? "Daily"
            : period === "monthly"
              ? "Monthly"
              : "Yearly"}{" "}
          Trends
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                Income Change
              </span>
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                  incomeChange >= 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span>{incomeChange >= 0 ? "↗" : "↘"}</span>
                <span>{Math.abs(incomeChange).toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
              >
                Expense Change
              </span>
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                  expenseChange <= 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span>{expenseChange <= 0 ? "↘" : "↗"}</span>
                <span>{Math.abs(expenseChange).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div
            className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-50"} rounded-2xl p-6`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }
                >
                  Transactions
                </span>
                <span
                  className={`font-semibold ${theme === "dark" ? "text-white" : ""}`}
                >
                  {currentPeriodTransactions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className={
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }
                >
                  Avg Daily
                </span>
                <span
                  className={`font-semibold ${theme === "dark" ? "text-white" : ""}`}
                >
                  Rp{" "}
                  {formatCurrency(
                    period === "daily"
                      ? displayIncome - displayExpense
                      : period === "monthly"
                        ? (displayIncome - displayExpense) / 30
                        : (displayIncome - displayExpense) / 365,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Charts
        income={displayIncome}
        expense={displayExpense}
        period={period}
        transactions={currentPeriodTransactions}
        allTransactions={transactions}
        theme={theme}
      />
    </div>
  );
}
