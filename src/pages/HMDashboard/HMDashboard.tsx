import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function HMDashboard() {
  const [data, setData] = useState<any>(null);

  const token = localStorage.getItem("token");

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/hm/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) {
    return (
      <DashboardLayout>
        <h2>Loading...</h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>HQ Manager Dashboard</h2>
        <p>
          Monitor all Steakz branches, revenue, orders, customer activity and
          performance.
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Branches</h3>
          <p>{data.summary.totalBranches}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Staff</h3>
          <p>{data.summary.totalStaff}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <p>{data.summary.totalOrders}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <p>£{Number(data.summary.totalRevenue).toFixed(2)}</p>
        </div>
      </div>

      <div className="dashboard-cards" style={{ marginTop: "20px" }}>
        <div className="dashboard-card">
          <h3>Paid Orders</h3>
          <p>{data.summary.paidOrders}</p>
        </div>

        <div className="dashboard-card">
          <h3>Low Stock Items</h3>
          <p>{data.summary.lowStockItems}</p>
        </div>

        <div className="dashboard-card">
          <h3>Active Branches</h3>
          <p>{data.summary.totalBranches}</p>
        </div>

        <div className="dashboard-card">
          <h3>System Status</h3>
          <p>Active</p>
        </div>
      </div>

      <div className="dashboard-panel">
        <h3>Best Performing Branch</h3>

        {data.summary.bestBranch ? (
          <p>
            {data.summary.bestBranch.branchName} - £
            {Number(data.summary.bestBranch.totalRevenue).toFixed(2)}
          </p>
        ) : (
          <p>No branch performance data available.</p>
        )}
      </div>

      <div className="dashboard-panel">
        <h3>Branch Sales</h3>

        {data.topRevenueBranches.length === 0 ? (
          <p>No revenue data available.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>Location</th>
                <th>Revenue</th>
                <th>Paid Orders</th>
              </tr>
            </thead>

            <tbody>
              {data.topRevenueBranches.map((branch: any) => (
                <tr key={branch.branchId}>
                  <td>{branch.branchName}</td>
                  <td>{branch.location}</td>
                  <td>£{Number(branch.totalRevenue).toFixed(2)}</td>
                  <td>{branch.paidOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-panel">
        <h3>Branch Performance Comparison</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Branch</th>
              <th>Location</th>
              <th>Staff</th>
              <th>Orders</th>
              <th>Paid Orders</th>
              <th>Revenue</th>
              <th>Inventory</th>
              <th>Low Stock</th>
              <th>Tables</th>
            </tr>
          </thead>

          <tbody>
            {data.branchReports.map((branch: any) => (
              <tr key={branch.branchId}>
                <td>{branch.branchName}</td>
                <td>{branch.location}</td>
                <td>{branch.totalStaff}</td>
                <td>{branch.totalOrders}</td>
                <td>{branch.paidOrders}</td>
                <td>£{Number(branch.totalRevenue).toFixed(2)}</td>
                <td>{branch.inventoryItems}</td>
                <td>{branch.lowStockItems}</td>
                <td>{branch.tables}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h3>Customer Activity</h3>

          {data.recentPaidOrders.length === 0 ? (
            <p>No recent customer order activity.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Branch</th>
                  <th>Table</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {data.recentPaidOrders.map((order: any) => (
                  <tr key={order.orderId}>
                    <td>#{order.orderId}</td>
                    <td>{order.branch?.branchName || "N/A"}</td>
                    <td>Table {order.table?.tableNumber}</td>
                    <td>{order.orderStatus}</td>
                    <td>£{Number(order.totalAmount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="dashboard-panel">
          <h3>Low Stock Overview</h3>

          {data.lowStockItems.length === 0 ? (
            <p>All branches have healthy inventory levels.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Branch</th>
                  <th>Stock</th>
                  <th>Unit</th>
                </tr>
              </thead>

              <tbody>
                {data.lowStockItems.slice(0, 8).map((item: any) => (
                  <tr key={item.inventoryId}>
                    <td>{item.ingredientName}</td>
                    <td>{item.branchName}</td>
                    <td>{item.quantityInStock}</td>
                    <td>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="dashboard-panel">
        <h3>Recent Paid Orders</h3>

        {data.recentPaidOrders.length === 0 ? (
          <p>No paid orders yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Table</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {data.recentPaidOrders.map((order: any) => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>Table {order.table?.tableNumber}</td>
                  <td>{order.orderStatus}</td>
                  <td>£{Number(order.totalAmount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default HMDashboard;