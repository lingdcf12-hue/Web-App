import { formatCurrency } from "../utils/formatCurrency";

export default function SummaryCard({
  title,
  value,
  color,
  change,
  theme = "light",
}) {
  const isPositive = value >= 0;
  const displayColor = color || (isPositive ? "green" : "red");

  return (
    <div
      className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border`}
    >
      <p
        className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-500"} mb-2`}
      >
        {title}
      </p>
      <p
        className={`text-3xl font-bold mb-2 ${
          displayColor === "green"
            ? "text-green-600"
            : displayColor === "red"
              ? "text-red-600"
              : "text-blue-600"
        }`}
      >
        Rp {formatCurrency(Math.abs(value))}
      </p>
      {change !== undefined && change !== null && (
        <div
          className={`flex items-center space-x-1 text-sm font-medium ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          <span>{change >= 0 ? "↗" : "↘"}</span>
          <span>{Math.abs(change).toFixed(1)}%</span>
          <span
            className={theme === "dark" ? "text-gray-400" : "text-gray-500"}
          >
            vs last month
          </span>
        </div>
      )}
      {value < 0 && (
        <p className="text-xs text-red-500 mt-1">Negative balance</p>
      )}
    </div>
  );
}
