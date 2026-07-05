import { useCallback, useEffect, useState } from "react";
import {
  FaArrowTrendUp,
  FaChartPie,
  FaLayerGroup,
  FaReceipt,
  FaTriangleExclamation,
  FaWallet,
} from "react-icons/fa6";
import DashboardChart from "../../components/DashboardChart/DashboardChart";
import MonthlyExpenseChart from "../../components/DashboardChart/MonthlyExpenseChart";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";
import "../../styles/Dashboard.css";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const toNumber = (value) => Number(value || 0);

const formatCurrency = (value) => currencyFormatter.format(toNumber(value));

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
};

const normalizeCategoryData = (data = []) => {
  return data.map((item) => ({
    ...item,
    category: item.category || item.categoryName || "Uncategorized",
    amount: toNumber(item.amount || item.totalAmount),
  }));
};

const normalizeMonthlyData = (data = []) => {
  return data.map((item) => ({
    ...item,
    month: item.month || "Unknown",
    amount: toNumber(item.amount || item.totalAmount),
  }));
};

const getRecentExpenses = (data = []) => {
  return [...data]
    .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate))
    .slice(0, 5);
};

function Dashboard() {
  const [dashboard, setDashboard] = useState({});
  const [chartData, setChartData] = useState([]);
  const [monthlyExpense, setMonthlyExpense] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [
        dashboardResponse,
        categoryResponse,
        monthlyResponse,
        expensesResponse,
      ] = await Promise.all([
        api.get("/dashboard"),
        api.get("/dashboard/category"),
        api.get("/dashboard/monthly"),
        api.get("/expenses/all"),
      ]);

      setDashboard(dashboardResponse.data || {});
      setChartData(normalizeCategoryData(categoryResponse.data));
      setMonthlyExpense(normalizeMonthlyData(monthlyResponse.data));
      setRecentExpenses(getRecentExpenses(expensesResponse.data));
    } catch (error) {
      console.error(error);
      setError(
        "We could not load your dashboard right now. Please check the backend connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(loadDashboardData);
  }, [loadDashboardData]);

  const totalExpenses = dashboard.totalExpenses || recentExpenses.length;
  const averageExpense =
    totalExpenses > 0 ? toNumber(dashboard.totalExpense) / totalExpenses : 0;

  const summaryCards = [
    {
      label: "Total Expense",
      value: formatCurrency(dashboard.totalExpense),
      detail: `${totalExpenses} tracked expenses`,
      icon: <FaWallet />,
      tone: "teal",
    },
    {
      label: "This Month",
      value: formatCurrency(dashboard.monthlyExpense),
      detail: "Current month spend",
      icon: <FaArrowTrendUp />,
      tone: "blue",
    },
    {
      label: "Categories",
      value: dashboard.totalCategories || 0,
      detail: "Active spending groups",
      icon: <FaLayerGroup />,
      tone: "amber",
    },
    {
      label: "Budgets",
      value: dashboard.totalBudgets || 0,
      detail: `Average ${formatCurrency(averageExpense)}`,
      icon: <FaReceipt />,
      tone: "rose",
    },
  ];

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <main className="dashboard-main">
          <section className="dashboard-hero">
            <div>
              <span className="dashboard-eyebrow">Overview</span>
              <h1>Dashboard</h1>
              <p>
                Track your spending, budget coverage, and recent activity from
                one clean workspace.
              </p>
            </div>

            <button
              className="refresh-button"
              disabled={loading}
              onClick={loadDashboardData}
              type="button"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </section>

          {error && (
            <div className="dashboard-alert" role="alert">
              <FaTriangleExclamation />
              <span>{error}</span>
            </div>
          )}

          <section className="summary-grid" aria-label="Expense summary">
            {summaryCards.map((card) => (
              <article
                className={`summary-card summary-card-${card.tone}`}
                key={card.label}
              >
                <div className="summary-icon">{card.icon}</div>
                <div>
                  <p>{card.label}</p>
                  <strong>{loading ? "..." : card.value}</strong>
                  <span>{card.detail}</span>
                </div>
              </article>
            ))}
          </section>

          <section className="dashboard-grid">
            <article className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <span>Category split</span>
                  <h2>Expense By Category</h2>
                </div>
                <FaChartPie />
              </div>

              <DashboardChart data={chartData} loading={loading} />
            </article>

            <article className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <span>Trend</span>
                  <h2>Monthly Expenses</h2>
                </div>
                <FaArrowTrendUp />
              </div>

              <MonthlyExpenseChart data={monthlyExpense} loading={loading} />
            </article>
          </section>

          <section className="dashboard-panel recent-panel">
            <div className="panel-header">
              <div>
                <span>Latest activity</span>
                <h2>Recent Expenses</h2>
              </div>
              <FaReceipt />
            </div>

            <div className="recent-table-wrap">
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Description</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="empty-cell">
                        Loading expenses...
                      </td>
                    </tr>
                  ) : recentExpenses.length > 0 ? (
                    recentExpenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>{formatDate(expense.expenseDate)}</td>
                        <td>
                          <span className="category-pill">
                            {expense.category || "Uncategorized"}
                          </span>
                        </td>
                        <td>{formatCurrency(expense.amount)}</td>
                        <td>{expense.description || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-cell">
                        No expenses found. Add your first expense to see it
                        here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
