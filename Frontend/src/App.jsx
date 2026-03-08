import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import History from "./pages/History";
import Reports from "./pages/Reports";
import TopNav from "./components/TopNav";
import { transactionAPI } from "./utils/api";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Fetch transactions dari backend
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAll();
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const addTransaction = (data) => {
    setTransactions([data, ...transactions]);
    setPage("dashboard");
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const refreshTransactions = () => {
    fetchTransactions();
  };

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-slate-50 to-slate-100"}`}
    >
      <TopNav
        currentPage={page}
        setPage={setPage}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <div className="max-w-6xl mx-auto pt-16 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        {loading && page !== "add" ? (
          <div className="flex justify-center items-center h-96">
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              Loading...
            </p>
          </div>
        ) : (
          <>
            {page === "dashboard" && (
              <Dashboard transactions={transactions} theme={theme} />
            )}
            {page === "add" && (
              <AddTransaction onSave={addTransaction} theme={theme} />
            )}
            {page === "history" && (
              <History
                transactions={transactions}
                onDelete={deleteTransaction}
                onRefresh={refreshTransactions}
                theme={theme}
              />
            )}
            {page === "reports" && (
              <Reports transactions={transactions} theme={theme} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
