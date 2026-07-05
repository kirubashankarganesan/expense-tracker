import { NavLink } from "react-router-dom";
import "../../styles/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Expense Tracker</h2>

      <nav>
        <NavLink to="/">Dashboard</NavLink>

        <NavLink to="/expenses">Expenses</NavLink>

        <NavLink to="/categories">Categories</NavLink>

        <NavLink to="/budgets">Budget</NavLink>

        <NavLink to="/recurring">Recurring</NavLink>

        <NavLink to="/reports">Reports</NavLink>

        <NavLink to="/profile">Profile</NavLink>

        <NavLink to="/settings">Settings</NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
