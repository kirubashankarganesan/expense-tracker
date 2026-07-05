import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const emptyBudget = {
  categoryId: "",
  monthlyLimit: "",
  month: "",
};

function BudgetForm({ loadBudgets }) {
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(emptyBudget);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudget((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveBudget = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await api.post("/budgets", budget);
      toast.success("Budget added");
      setBudget(emptyBudget);
      await loadBudgets();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save budget");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="app-card" onSubmit={saveBudget}>
      <h2>Add Budget</h2>

      <div className="app-form-grid">
        <select
          className="form-select"
          name="categoryId"
          onChange={handleChange}
          required
          value={budget.categoryId}
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
          min="1"
          name="monthlyLimit"
          onChange={handleChange}
          placeholder="Monthly Budget"
          required
          type="number"
          value={budget.monthlyLimit}
        />

        <input
          className="form-control"
          name="month"
          onChange={handleChange}
          required
          type="month"
          value={budget.month}
        />

        <div className="app-actions">
          <button className="btn btn-success" disabled={saving} type="submit">
            {saving ? "Saving..." : "Save Budget"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default BudgetForm;
