import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const emptyExpense = {
  amount: "",
  description: "",
  expenseDate: "",
  categoryId: "",
  recurring: false,
};

function ExpenseForm({
  editingExpense,
  isEditing,
  loadExpenses,
  setEditingExpense,
  setIsEditing,
}) {
  const [categories, setCategories] = useState([]);
  const [expense, setExpense] = useState(emptyExpense);
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    }
  }, []);

  useEffect(() => {
    queueMicrotask(loadCategories);
  }, [loadCategories]);

  useEffect(() => {
    if (!editingExpense) return;

    queueMicrotask(() => {
      const matchedCategory = categories.find(
        (category) => category.name === editingExpense.category,
      );

      setExpense({
        amount: editingExpense.amount || "",
        description: editingExpense.description || "",
        expenseDate: editingExpense.expenseDate || "",
        categoryId: editingExpense.categoryId || matchedCategory?.id || "",
        recurring: Boolean(editingExpense.recurring),
      });
    });
  }, [categories, editingExpense]);

  const handleChange = (e) => {
    const { checked, name, type, value } = e.target;

    setExpense((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setExpense(emptyExpense);
    setEditingExpense(null);
    setIsEditing(false);
  };

  const saveExpense = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (isEditing && editingExpense?.id) {
        await api.put(`/expenses/${editingExpense.id}`, expense);
        toast.success("Expense updated");
      } else {
        await api.post("/expenses", expense);
        toast.success("Expense added");
      }

      resetForm();
      await loadExpenses();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save expense");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="app-card" onSubmit={saveExpense}>
      <h2>{isEditing ? "Edit Expense" : "Add Expense"}</h2>

      <div className="app-form-grid">
        <input
          className="form-control"
          min="1"
          name="amount"
          onChange={handleChange}
          placeholder="Amount"
          required
          type="number"
          value={expense.amount}
        />

        <select
          className="form-select"
          name="categoryId"
          onChange={handleChange}
          required
          value={expense.categoryId}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          className="form-control"
          name="expenseDate"
          onChange={handleChange}
          required
          type="date"
          value={expense.expenseDate}
        />

        <input
          className="form-control"
          name="description"
          onChange={handleChange}
          placeholder="Description"
          value={expense.description}
        />

        <label className="form-check full-width">
          <input
            checked={expense.recurring}
            className="form-check-input"
            name="recurring"
            onChange={handleChange}
            type="checkbox"
          />
          <span className="form-check-label ms-2">Recurring Expense</span>
        </label>

        <div className="app-actions full-width">
          <button className="btn btn-primary" disabled={saving} type="submit">
            {saving
              ? "Saving..."
              : isEditing
                ? "Update Expense"
                : "Save Expense"}
          </button>

          {isEditing && (
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
  );
}

export default ExpenseForm;
