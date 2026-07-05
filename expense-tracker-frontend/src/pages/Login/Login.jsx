import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContextInstance";
import "../../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      login(response.data.token);
      toast.success("Welcome back! Login successful");
      navigate("/");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo" />
          <div>
            <span>Expense Tracker</span>
            <strong>Sign in</strong>
          </div>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <h2>Welcome back</h2>
          <p className="auth-copy">
            Manage spending, budgets, and reports securely.
          </p>

          <label className="form-label">Email</label>
          <input
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />

          <label className="form-label">Password</label>
          <input
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            type="password"
            value={password}
          />

          <button className="btn btn-primary" type="submit">
            Login
          </button>

          <p className="auth-link">
            Don't have an account?
            <Link to="/register">Register</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;
