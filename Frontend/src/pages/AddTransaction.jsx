import { useState } from "react";
import { formatCurrency } from "../utils/formatCurrency";
import { transactionAPI } from "../utils/api";

export default function AddTransaction({ onSave, theme }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!amount || amount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }
    if (!category.trim()) {
      newErrors.category = "Please enter a category";
    }
    if (!date) {
      newErrors.date = "Please select a date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCurrencyInput = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue ? parseInt(numericValue).toLocaleString("id-ID") : "";
  };

  const handleAmountChange = (e) => {
    const formatted = formatCurrencyInput(e.target.value);
    setAmount(formatted);
    if (errors.amount) {
      setErrors({ ...errors, amount: null });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const transaction = {
        type,
        amount: parseInt(amount.replace(/\D/g, "")),
        category: category.trim(),
        date: new Date(date).toISOString(),
        notes: notes.trim(),
      };

      // Kirim ke backend
      const response = await transactionAPI.create(transaction);
      console.log("Transaction saved:", response.data);

      // Update UI setelah berhasil
      onSave(response.data);
      setSuccessMessage("Transaction added successfully!");
      setAmount("");
      setCategory("");
      setNotes("");
      setDate(new Date().toISOString().split("T")[0]);
      setType("expense");
      setErrors({});
    } catch (error) {
      console.error("Error saving transaction:", error);
      setSuccessMessage(
        `Error: ${error.response?.data?.message || "Failed to save transaction"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h1
          className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Add Transaction
        </h1>
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Record your income or expense
        </p>
      </div>

      <div
        className={`max-w-2xl mx-auto rounded-3xl p-8 shadow-sm ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        {successMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl ${theme === "dark" ? "bg-gray-700 border border-gray-600" : "bg-green-50 border border-green-200"}`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-green-600 text-xl">✓</span>
              <p
                className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-green-800"}`}
              >
                {successMessage}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Type Toggle */}
          <div>
            <label
              className={`block text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Transaction Type
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setType("income")}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                  type === "income"
                    ? "bg-green-600 text-white shadow-lg transform scale-105"
                    : theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                💰 Income
              </button>
              <button
                onClick={() => setType("expense")}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                  type === "expense"
                    ? "bg-red-600 text-white shadow-lg transform scale-105"
                    : theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                💸 Expense
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label
              className={`block text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Amount (Rp)
            </label>
            <input
              type="text"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              className={`w-full p-4 rounded-2xl border-2 text-xl font-bold transition-all duration-200 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""} ${
                errors.amount
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              }`}
            />
            {errors.amount && (
              <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Category Input */}
          <div>
            <label
              className={`block text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Category
            </label>
            <input
              type="text"
              placeholder="e.g., Food, Salary, Transport"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) {
                  setErrors({ ...errors, category: null });
                }
              }}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""} ${
                errors.category
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              }`}
            />
            {errors.category && (
              <p className="mt-2 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label
              className={`block text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) {
                  setErrors({ ...errors, date: null });
                }
              }}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : ""} ${
                errors.date
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              }`}
            />
            {errors.date && (
              <p className="mt-2 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label
              className={`block text-sm font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Notes (Optional)
            </label>
            <textarea
              placeholder="Add any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 resize-none ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-200"} focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100`}
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Save Transaction"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
