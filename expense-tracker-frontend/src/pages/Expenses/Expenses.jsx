import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AppShell from "../../components/AppShell/AppShell";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm";
import api from "../../services/api";

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

function Expenses() {
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/expenses/all");
      setExpenses(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(loadExpenses);
  }, [loadExpenses]);

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await api.delete(`/expenses/${id}`);
      toast.success("Expense deleted");
      await loadExpenses();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    }
  };

  const filteredExpenses = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return expenses;

    return expenses.filter((expense) => {
      return (
        (expense.description || "").toLowerCase().includes(keyword) ||
        (expense.category || "").toLowerCase().includes(keyword)
      );
    });
  }, [expenses, search]);

  return (
    <AppShell>
      <main className="app-page">
        <header className="app-page-header">
          <div>
            <span className="app-page-kicker">Track</span>
            <h1>Expenses</h1>
            <p>
              Add, search, edit, and remove expenses with reliable category
              data.
            </p>
          </div>
        </header>

        <ExpenseForm
          editingExpense={editingExpense}
          isEditing={isEditing}
          loadExpenses={loadExpenses}
          setEditingExpense={setEditingExpense}
          setIsEditing={setIsEditing}
        />

        <section className="app-card">
          <div className="app-page-header">
            <div>
              <h2>Expense List</h2>
            </div>
            <input
              className="form-control"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category or description..."
              style={{ maxWidth: 360 }}
              type="text"
              value={search}
            />
          </div>

          {loading ? (
            <div className="empty-state">Loading expenses...</div>
          ) : filteredExpenses.length === 0 ? (
            <div className="empty-state">No expenses found.</div>
          ) : (
            <div className="app-table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Recurring</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>
                        {dateFormatter.format(new Date(expense.expenseDate))}
                      </td>
                      <td>
                        <span className="status-pill status-pill-blue">
                          {expense.category || "Uncategorized"}
                        </span>
                      </td>
                      <td>
                        {currencyFormatter.format(Number(expense.amount || 0))}
                      </td>
                      <td>{expense.description || "-"}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            expense.recurring
                              ? "status-pill-green"
                              : "status-pill-gray"
                          }`}
                        >
                          {expense.recurring ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <div className="app-actions">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              setEditingExpense(expense);
                              setIsEditing(true);
                            }}
                            type="button"
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteExpense(expense.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
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

export default Expenses;
