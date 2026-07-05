import { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  FiCheckCircle,
  FiClock,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";
import AppShell from "../../components/AppShell/AppShell";
import { useAuth } from "../../context/AuthContextInstance";
import api from "../../services/api";

function Profile() {
  const { token } = useAuth();
  const decoded = token ? jwtDecode(token) : null;
  const expiresAt = decoded?.exp
    ? new Date(decoded.exp * 1000).toLocaleString("en-IN")
    : "Unknown";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    email: "",
    name: "",
  });
  const displayName = user.name?.trim() || "Expense Tracker User";
  const initials = (displayName || user.email || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/profile");
      setUser(response.data || { email: "", name: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(loadProfile);
  }, [loadProfile]);

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const response = await api.put("/users/profile", { name: user.name });
      setUser(response.data);
      toast.success("Profile updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <main className="app-page">
        <header className="app-page-header">
          <div>
            <span className="app-page-kicker">Account</span>
            <h1>Profile</h1>
            <p>
              Keep your personal details fresh and review the active session.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="app-card">
            <div className="empty-state">Loading profile...</div>
          </div>
        ) : (
          <section className="profile-layout">
            <aside className="profile-summary app-card">
              <div className="profile-cover" aria-hidden="true" />

              <div className="profile-identity">
                <div className="profile-avatar" aria-hidden="true">
                  {initials}
                </div>

                <div>
                  <h2>{displayName}</h2>
                  <p>{user.email}</p>
                </div>
              </div>

              <div className="profile-meta-list">
                <div className="profile-meta-item">
                  <FiMail />
                  <span>Email verified for account access</span>
                </div>
                <div className="profile-meta-item">
                  <FiClock />
                  <span>Session expires {expiresAt}</span>
                </div>
                <div className="profile-meta-item">
                  <FiShield />
                  <span>Protected by your secure login token</span>
                </div>
              </div>
            </aside>

            <form className="profile-edit app-card" onSubmit={updateProfile}>
              <div className="profile-card-title">
                <FiUser />
                <div>
                  <h2>Account Details</h2>
                  <p>Update the name shown across your workspace.</p>
                </div>
              </div>

              <div className="app-form-grid">
                <div className="profile-field">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    onChange={(e) =>
                      setUser((current) => ({
                        ...current,
                        name: e.target.value,
                      }))
                    }
                    required
                    value={user.name}
                  />
                </div>

                <div className="profile-field">
                  <label className="form-label">Email</label>
                  <input className="form-control" disabled value={user.email} />
                </div>

                <div className="profile-field full-width">
                  <label className="form-label">Session Expires</label>
                  <input className="form-control" disabled value={expiresAt} />
                </div>

                <div className="profile-security-note full-width">
                  <FiShield />
                  <div>
                    <strong>Account security</strong>
                    <span>
                      Your email and session details are managed by your login.
                    </span>
                  </div>
                </div>

                <div className="app-actions profile-submit full-width">
                  <button
                    className="btn btn-primary"
                    disabled={saving}
                    type="submit"
                  >
                    {saving ? "Saving..." : "Update Profile"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}
      </main>
    </AppShell>
  );
}

export default Profile;
