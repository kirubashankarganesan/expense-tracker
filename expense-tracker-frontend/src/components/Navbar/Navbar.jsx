import { jwtDecode } from "jwt-decode";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContextInstance";
import "../../styles/Navbar.css";

const pageTitles = {
  "/": {
    eyebrow: "Overview",
    title: "Dashboard",
  },
  "/expenses": {
    eyebrow: "Manage",
    title: "Expenses",
  },
  "/categories": {
    eyebrow: "Organize",
    title: "Categories",
  },
  "/budgets": {
    eyebrow: "Planning",
    title: "Budget",
  },
  "/recurring": {
    eyebrow: "Automation",
    title: "Recurring",
  },
  "/reports": {
    eyebrow: "Insights",
    title: "Reports",
  },
  "/profile": {
    eyebrow: "Account",
    title: "Profile",
  },
  "/settings": {
    eyebrow: "Workspace",
    title: "Settings",
  },
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, token } = useAuth();
  const decoded = token ? jwtDecode(token) : {};
  const accountLabel =
    decoded?.name || decoded?.sub || decoded?.email || "Account";
  const initials = accountLabel
    .split(/[ @.]/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const page = pageTitles[location.pathname] || {
    eyebrow: "Expense Tracker",
    title: "Workspace",
  };

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-page">
        <span>{page.eyebrow}</span>
        <strong>{page.title}</strong>
      </div>

      <div className="navbar-actions">
        <div className="navbar-user">
          <span className="navbar-avatar" aria-hidden="true">
            {initials || "U"}
          </span>
          <span className="navbar-user-name">{accountLabel}</span>
        </div>

        <button className="navbar-logout" onClick={handleLogout} type="button">
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
