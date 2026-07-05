import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppShell from "../../components/AppShell/AppShell";
import CategoryForm from "../../components/CategoryForm/CategoryForm";
import api from "../../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(loadCategories);
  }, [loadCategories]);

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      await loadCategories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <AppShell>
      <main className="app-page">
        <header className="app-page-header">
          <div>
            <span className="app-page-kicker">Organize</span>
            <h1>Categories</h1>
            <p>
              Group expenses into clean categories for better reports and
              budgets.
            </p>
          </div>
        </header>

        <CategoryForm loadCategories={loadCategories} />

        <section className="app-card">
          <h2>Category List</h2>

          {loading ? (
            <div className="empty-state">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              No categories found. Add one above.
            </div>
          ) : (
            <div className="app-table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <span className="status-pill status-pill-blue">
                          {category.name}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteCategory(category.id)}
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

export default Categories;
