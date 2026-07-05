import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import "../../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Account created successfully");
      navigate("/login");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo" />
          <div>
            <span>Expense Tracker</span>
            <strong>Create account</strong>
          </div>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          <h2>Start tracking smarter</h2>
          <p className="auth-copy">
            Create your workspace for expenses and budgets.
          </p>

          <label className="form-label">Name</label>
          <input
            className="form-control"
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            type="text"
            value={name}
          />

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
            placeholder="Create a password"
            required
            type="password"
            value={password}
          />

          <button className="btn btn-primary" type="submit">
            Register
          </button>

          <p className="auth-link">
            Already have an account?
            <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Register;
