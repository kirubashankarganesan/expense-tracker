import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppShell from "../../components/AppShell/AppShell";
import { applyTheme, getStoredTheme, saveTheme } from "../../utils/theme";

function Settings() {
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "INR",
  );
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const saveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem("currency", currency);
    saveTheme(theme);
    toast.success("Settings saved");
  };

  return (
    <AppShell>
      <main className="app-page">
        <header className="app-page-header">
          <div>
            <span className="app-page-kicker">Preferences</span>
            <h1>Settings</h1>
            <p>
              Store simple local preferences for your expense tracker workspace.
            </p>
          </div>
        </header>

        <form className="app-card" onSubmit={saveSettings}>
          <h2>Workspace Settings</h2>

          <div className="app-form-grid">
            <div>
              <label className="form-label">Theme</label>
              <select
                className="form-select"
                onChange={(e) => setTheme(e.target.value)}
                value={theme}
              >
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>

            <div>
              <label className="form-label">Currency</label>
              <select
                className="form-select"
                onChange={(e) => setCurrency(e.target.value)}
                value={currency}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div className="app-actions full-width">
              <button className="btn btn-primary" type="submit">
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </main>
    </AppShell>
  );
}

export default Settings;
