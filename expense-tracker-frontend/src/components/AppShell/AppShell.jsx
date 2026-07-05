import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

function AppShell({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default AppShell;
