import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2>🥩 Steakz</h2>

      <nav>
        {role === "ADMIN" && (
          <>
            <Link to="/admin">📈 Dashboard</Link>
            <Link to="/admin/users">👥 User Management</Link>
            <Link to="/admin/branches">🏢 Branch Management</Link>
          </>
        )}

        {role === "HM" && (
          <>
            <Link to="/hm">📊 Analytics Dashboard</Link>
            <Link to="/hm/reports">📄 Reports</Link>
          </>
        )}

        {role === "BM" && (
          <>
            <Link to="/bm">🏢 Branch Dashboard</Link>
            <Link to="/bm/inventory">📦 Inventory</Link>
          </>
        )}

        {role === "WAITER" && (
          <>
            <Link to="/waiter">📝 Customer Orders</Link>
          </>
        )}

        {role === "CHEF" && (
          <>
            <Link to="/chef">👨‍🍳 Kitchen Orders</Link>
            <Link to="/chef/menu">🍽️ Menu Management</Link>
          </>
        )}

        {role === "CASHIER" && (
          <>
            <Link to="/cashier">💳 Payments</Link>
          </>
        )}

        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            textAlign: "left",
            padding: "12px 0",
            fontSize: "18px",
          }}
        >
          🚪 Logout
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;