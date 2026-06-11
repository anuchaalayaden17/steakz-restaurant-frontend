import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function BMDashboard() {
  const [data, setData] = useState<any>(null);
  const token = localStorage.getItem("token");

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/bm/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
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
        <h2>{data.branch?.branchName} Dashboard</h2>
        <p>View branch orders, sales, staff performance, inventory and reports.</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <p>{data.summary.totalOrders}</p>
        </div>

        <div className="dashboard-card">
          <h3>Branch Sales</h3>
          <p>£{Number(data.summary.totalRevenue).toFixed(2)}</p>
        </div>

        <div className="dashboard-card">
          <h3>Staff Members</h3>
          <p>{data.summary.totalStaff}</p>
        </div>

        <div className="dashboard-card">
          <h3>Low Stock Items</h3>
          <p>{data.summary.lowStockItems}</p>
        </div>
      </div>

      <div className="dashboard-panel">
        <h3>View Branch Orders</h3>

        {data.orders.length === 0 ? (
          <p>No orders found for this branch.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Table</th>
                <th>Staff</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {data.orders.slice(0, 8).map((order: any) => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>Table {order.table?.tableNumber}</td>
                  <td>
                    {order.user
                      ? `${order.user.firstName} ${order.user.lastName}`
                      : "N/A"}
                  </td>
                  <td>{order.orderStatus}</td>
                  <td>£{Number(order.totalAmount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h3>View Staff Performance</h3>

          {data.staffPerformance.length === 0 ? (
            <p>No staff performance data available.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>Role</th>
                  <th>Orders</th>
                  <th>Paid Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>

              <tbody>
                {data.staffPerformance.map((staff: any) => (
                  <tr key={staff.userId}>
                    <td>{staff.name}</td>
                    <td>{staff.role}</td>
                    <td>{staff.totalOrders}</td>
                    <td>{staff.paidOrders}</td>
                    <td>£{Number(staff.revenue).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="dashboard-panel">
          <h3>Monitor Inventory</h3>

          {data.lowStockItems.length === 0 ? (
            <p>All inventory levels are healthy.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Stock</th>
                  <th>Unit</th>
                </tr>
              </thead>

              <tbody>
                {data.lowStockItems.map((item: any) => (
                  <tr key={item.inventoryId}>
                    <td>{item.ingredientName}</td>
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
        <h3>View Branch Reports</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Branch</th>
              <th>Orders</th>
              <th>Pending</th>
              <th>Completed</th>
              <th>Paid</th>
              <th>Sales</th>
              <th>Inventory Items</th>
              <th>Tables</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{data.branch?.branchName}</td>
              <td>{data.summary.totalOrders}</td>
              <td>{data.summary.pendingOrders}</td>
              <td>{data.summary.completedOrders}</td>
              <td>{data.summary.paidOrders}</td>
              <td>£{Number(data.summary.totalRevenue).toFixed(2)}</td>
              <td>{data.summary.totalInventoryItems}</td>
              <td>{data.summary.totalTables}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default BMDashboard;