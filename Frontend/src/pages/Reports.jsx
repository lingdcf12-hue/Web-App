import { useState } from "react";
import { formatCurrency } from "../utils/formatCurrency";

export default function Reports({ transactions, theme }) {
  const [period, setPeriod] = useState("month");

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    switch (period) {
      case "month":
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      case "year":
        return date.getFullYear() === currentYear;
      default:
        return true;
    }
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const categories = {};
  filteredTransactions.forEach((t) => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });

  const total = totalIncome + totalExpense;

  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const topCategories = sortedCategories.slice(0, 5);

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1
          className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Financial Reports
        </h1>
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          Analyze your spending patterns
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div
          className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl p-1 shadow-sm`}
        >
          <button
            onClick={() => setPeriod("month")}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              period === "month"
                ? "bg-emerald-600 text-white shadow-lg"
                : theme === "dark"
                  ? "text-gray-300 hover:text-emerald-400"
                  : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod("year")}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              period === "year"
                ? "bg-emerald-600 text-white shadow-lg"
                : theme === "dark"
                  ? "text-gray-300 hover:text-emerald-400"
                  : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            This Year
          </button>
          <button
            onClick={() => setPeriod("all")}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              period === "all"
                ? "bg-emerald-600 text-white shadow-lg"
                : theme === "dark"
                  ? "text-gray-300 hover:text-emerald-400"
                  : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div
          className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 shadow-sm`}
        >
          <h2
            className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Financial Overview
          </h2>
          <div className="space-y-6">
            <div
              className={`flex items-center justify-between p-4 rounded-2xl ${theme === "dark" ? "bg-gray-700" : "bg-green-50"}`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-600" : "bg-green-100"}`}
                >
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Total Income
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    Rp {formatCurrency(totalIncome)}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-2xl ${theme === "dark" ? "bg-gray-700" : "bg-red-50"}`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-600" : "bg-red-100"}`}
                >
                  <span className="text-2xl">💸</span>
                </div>
                <div>
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Total Expense
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    Rp {formatCurrency(totalExpense)}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-2xl ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"}`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-gray-600" : "bg-blue-100"}`}
                >
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Net Balance
                  </p>
                  <p
                    className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    Rp {formatCurrency(totalIncome - totalExpense)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 shadow-sm`}
        >
          <h2
            className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Top Categories
          </h2>
          {topCategories.length === 0 ? (
            <p
              className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              No data available
            </p>
          ) : (
            <div className="space-y-4">
              {topCategories.map(([category, amount], index) => {
                const percentage =
                  total > 0 ? Math.round((amount / total) * 100) : 0;
                const isIncome =
                  filteredTransactions.find((t) => t.category === category)
                    ?.type === "income";

                return (
                  <div
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isIncome
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p
                          className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                        >
                          {category}
                        </p>
                        <p
                          className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Rp {formatCurrency(amount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                      >
                        {percentage}%
                      </p>
                      <div
                        className={`w-20 rounded-full h-2 mt-1 ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}
                      >
                        <div
                          className={`h-2 rounded-full ${isIncome ? "bg-green-500" : "bg-red-500"}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div
        className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 shadow-sm`}
      >
        <h2
          className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Detailed Breakdown
        </h2>

        {sortedCategories.length === 0 ? (
          <p
            className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            No transactions found for the selected period.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th
                    className={`text-left py-3 px-4 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}
                  >
                    Category
                  </th>
                  <th
                    className={`text-right py-3 px-4 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}
                  >
                    Amount
                  </th>
                  <th
                    className={`text-right py-3 px-4 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}
                  >
                    Percentage
                  </th>
                  <th
                    className={`text-center py-3 px-4 font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}
                  >
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories.map(([category, amount]) => {
                  const percentage =
                    total > 0 ? Math.round((amount / total) * 100) : 0;
                  const isIncome =
                    filteredTransactions.find((t) => t.category === category)
                      ?.type === "income";

                  return (
                    <tr
                      key={category}
                      className={`border-b transition-colors duration-200 ${theme === "dark" ? "border-gray-700 hover:bg-gray-700" : "border-gray-100 hover:bg-gray-50"}`}
                    >
                      <td
                        className={`py-4 px-4 font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}
                      >
                        {category}
                      </td>
                      <td
                        className={`py-4 px-4 text-right font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}
                      >
                        Rp {formatCurrency(amount)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <span
                            className={`font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-900"}`}
                          >
                            {percentage}%
                          </span>
                          <div
                            className={`w-16 rounded-full h-2 ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}
                          >
                            <div
                              className={`h-2 rounded-full ${isIncome ? "bg-green-500" : "bg-red-500"}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isIncome
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isIncome ? "Income" : "Expense"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
