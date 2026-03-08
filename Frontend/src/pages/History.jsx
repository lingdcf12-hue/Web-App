import { useState } from "react";
import TransactionItem from "../components/TransactionItem";
import { formatCurrency } from "../utils/formatCurrency";
import { transactionAPI } from "../utils/api";

export default function History({ transactions, onDelete, onRefresh, theme }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesCategory =
      filterCategory === "all" ||
      t.category.toLowerCase() === filterCategory.toLowerCase();

    return matchesSearch && matchesType && matchesCategory;
  });

  const groupedTransactions = filteredTransactions.reduce(
    (groups, transaction) => {
      const date = transaction.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {},
  );

  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  const categories = [...new Set(transactions.map((t) => t.category))];

  const handleDelete = async (id) => {
    try {
      await transactionAPI.delete(id);
      onDelete(id);
      onRefresh();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction");
    }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1
          className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Transaction History
        </h1>
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          View and manage your transactions
        </p>
      </div>

      <div
        className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-6 shadow-sm mb-8`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              className={`block text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-900" : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"}`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-400 focus:ring-emerald-900" : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"}`}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white focus:border-emerald-400 focus:ring-emerald-900" : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"}`}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sortedDates.length === 0 ? (
          <div
            className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl p-12 text-center shadow-sm`}
          >
            <div className="text-6xl mb-4">📊</div>
            <h3
              className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              No transactions found
            </h3>
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div
              key={date}
              className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-3xl shadow-sm overflow-hidden`}
            >
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4">
                <h3 className="text-lg font-semibold">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <p className="text-emerald-100 text-sm">
                  {groupedTransactions[date].length} transaction
                  {groupedTransactions[date].length !== 1 ? "s" : ""}
                </p>
              </div>
              <div
                className={`divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-100"}`}
              >
                {groupedTransactions[date].map((t) => (
                  <TransactionItem
                    key={t.id}
                    data={t}
                    onDelete={handleDelete}
                    theme={theme}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
