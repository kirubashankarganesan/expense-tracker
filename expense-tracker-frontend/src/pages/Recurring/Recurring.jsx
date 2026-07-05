import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AppShell from "../../components/AppShell/AppShell";
import api from "../../services/api";

const emptyRecurring = {
  amount: "",
  categoryId: "",
  description: "",
  frequency: "MONTHLY",
  nextDueDate: "",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function Recurring() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyRecurring);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [categoryResponse, recurringResponse] = await Promise.all([
        api.get("/categories"),
        api.get("/recurring-expenses"),
      ]);

      setCategories(categoryResponse.data || []);
      setItems(recurringResponse.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load recurring expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(loadData);
  }, [loadData]);

  const categoryByName = useMemo(() => {
    return new Map(categories.map((category) => [category.name, category.id]));
  }, [categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyRecurring);
    setEditingId(null);
  };

  const saveRecurring = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/recurring-expenses/${editingId}`, form);
        toast.success("Recurring expense updated");
      } else {
        await api.post("/recurring-expenses", form);
        toast.success("Recurring expense added");
      }

      resetForm();
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save recurring expense");
    } finally {
      setSaving(false);
    }
  };

  const editRecurring = (item) => {
    setEditingId(item.id);
    setForm({
      amount: item.amount || "",
      categoryId: categoryByName.get(item.category) || "",
      description: item.description || "",
      frequency: item.frequency || "MONTHLY",
      nextDueDate: item.nextDueDate || "",
    });
  };

  const toggleRecurring = async (id) => {
    try {
      await api.patch(`/recurring-expenses/${id}/toggle`);
      toast.success("Recurring status updated");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update recurring status");
    }
  };

  const deleteRecurring = async (id) => {
    if (!window.confirm("Delete this recurring expense?")) return;

    try {
      await api.delete(`/recurring-expenses/${id}`);
      toast.success("Recurring expense deleted");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete recurring expense");
    }
  };

  return (
    <AppShell>
      <main className="app-page">
        <header className="app-page-header">
          <div>
            <span className="app-page-kicker">Automation</span>
            <h1>Recurring Expenses</h1>
            <p>
              Schedule repeating expenses so regular bills are tracked
              automatically.
            </p>
          </div>
        </header>

        <form className="app-card" onSubmit={saveRecurring}>
          <h2>
            {editingId ? "Edit Recurring Expense" : "Add Recurring Expense"}
          </h2>

          <div className="app-form-grid">
            <input
              className="form-control"
              min="1"
              name="amount"
              onChange={handleChange}
              placeholder="Amount"
              required
              type="number"
              value={form.amount}
            />

            <select
              className="form-select"
              name="categoryId"
              onChange={handleChange}
              required
              value={form.categoryId}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              name="frequency"
              onChange={handleChange}
              required
              value={form.frequency}
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>

            <input
              className="form-control"
              name="nextDueDate"
              onChange={handleChange}
              required
              type="date"
              value={form.nextDueDate}
            />

            <input
              className="form-control full-width"
              name="description"
              onChange={handleChange}
              placeholder="Description"
              value={form.description}
            />

            <div className="app-actions full-width">
              <button
                className="btn btn-primary"
                disabled={saving}
                type="submit"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Save"}
              </button>

              {editingId && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={resetForm}
                  type="button"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        <section className="app-card">
          <h2>Recurring List</h2>

          {loading ? (
            <div className="empty-state">Loading recurring expenses...</div>
          ) : items.length === 0 ? (
            <div className="empty-state">No recurring expenses found.</div>
          ) : (
            <div className="app-table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Frequency</th>
                    <th>Next Due</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className="status-pill status-pill-blue">
                          {item.category || "Uncategorized"}
                        </span>
                      </td>
                      <td>
                        {currencyFormatter.format(Number(item.amount || 0))}
                      </td>
                      <td>{item.frequency}</td>
                      <td>{item.nextDueDate}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            item.active
                              ? "status-pill-green"
                              : "status-pill-gray"
                          }`}
                        >
                          {item.active ? "Active" : "Paused"}
                        </span>
                      </td>
                      <td>
                        <div className="app-actions">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => editRecurring(item)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => toggleRecurring(item.id)}
                            type="button"
                          >
                            {item.active ? "Pause" : "Resume"}
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => deleteRecurring(item.id)}
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

export default Recurring;
