import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

function CategoryForm({ loadCategories }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const saveCategory = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await api.post("/categories", { name: name.trim() });
      toast.success("Category added");
      setName("");
      await loadCategories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="app-card" onSubmit={saveCategory}>
      <h2>Add Category</h2>

      <div className="app-form-grid">
        <input
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
          value={name}
        />

        <div className="app-actions">
          <button className="btn btn-primary" disabled={saving} type="submit">
            {saving ? "Saving..." : "Add Category"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default CategoryForm;
