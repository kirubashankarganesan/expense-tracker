import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import BudgetForm from "../../components/BudgetForm/BudgetForm";
import AppShell from "../../components/AppShell/AppShell";
import api from "../../services/api";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/budgets");
      setBudgets(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(loadBudgets);
  }, [loadBudgets]);

  const deleteBudget = async (id) => {
    if (!window.confirm("Delete this budget?")) return;

    try {
      await api.delete(`/budgets/${id}`);
      toast.success("Budget deleted");
      await loadBudgets();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete budget");
    }
  };

  return (
    <AppShell>
      <main className="app-page">
        <header className="app-page-header">
          <div>
            <span className="app-page-kicker">Planning</span>
            <h1>Budgets</h1>
            <p>
              Create monthly limits for categories and keep spending
              intentional.
            </p>
          </div>
        </header>

        <BudgetForm loadBudgets={loadBudgets} />

        <section className="app-card">
          <h2>Budget List</h2>

          {loading ? (
            <div className="empty-state">Loading budgets...</div>
          ) : budgets.length === 0 ? (
            <div className="empty-state">
              No budgets found. Add a budget above.
            </div>
          ) : (
            <div className="app-table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Limit</th>
                    <th>Month</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {budgets.map((budget) => (
                    <tr key={budget.id}>
                      <td>
                        <span className="status-pill status-pill-blue">
                          {budget.category || "Uncategorized"}
                        </span>
                      </td>
                      <td>
                        {currencyFormatter.format(
                          Number(budget.monthlyLimit || 0),
                        )}
                      </td>
                      <td>{budget.month}</td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteBudget(budget.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}

export default Budget;
