import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const roleMap: Record<string, string> = {
    "/admin": "ADMIN",
    "/admin/users": "ADMIN",
    "/admin/branches": "ADMIN",
    "/hm": "HQ MANAGER",
    "/hm/reports": "HQ MANAGER",
    "/bm": "BRANCH MANAGER",
    "/chef": "CHEF",
    "/cashier": "CASHIER",
    "/waiter": "WAITER",
  };

  const roleName = roleMap[location.pathname] || user?.role || "USER";

  let subtitle = "";

  if (user?.role === "ADMIN") {
    subtitle = "System Administrator";
  } else if (user?.role === "HM") {
    subtitle = "Branch: All Branches";
  } else {
    subtitle = `Branch: ${user?.branch?.branchName || "Unknown"}`;
  }

  return (
    <header className="dashboard-navbar">
      <div>
        <h1>Steakz Restaurant Management System</h1>

        <p>{roleName}</p>

        <p
          style={{
            marginTop: "4px",
            fontSize: "14px",
            color: "#6b7280",
            fontWeight: 600,
          }}
        >
          {subtitle}
        </p>
      </div>
    </header>
  );
}

export default Navbar;