import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function ChefDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchOrders = async () => {
    const response = await api.get("/chef/orders", { headers });
    setOrders(response.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: number, orderStatus: string) => {
    await api.patch(
      `/chef/orders/${orderId}/status`,
      { orderStatus },
      { headers }
    );

    fetchOrders();
  };

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "Pending"
  );

  const preparingOrders = orders.filter(
    (order) => order.orderStatus === "Preparing"
  );

  const readyOrders = orders.filter((order) => order.orderStatus === "Ready");

  const renderOrderCard = (order: any) => (
    <div className="dashboard-panel" key={order.orderId}>
      <h3>
        Order #{order.orderId} - Table {order.table?.tableNumber}
      </h3>

      <p>
        <strong>Status:</strong> {order.orderStatus}
      </p>

      <p>
        <strong>Branch:</strong> {order.branch?.branchName}
      </p>

      <ul>
        {order.orderItems.map((item: any) => (
          <li key={item.orderItemId}>
            {item.quantity}x {item.menuItem.itemName}
          </li>
        ))}
      </ul>

      <p>
        <strong>Total:</strong> £{Number(order.totalAmount).toFixed(2)}
      </p>

      {order.orderStatus === "Pending" && (
        <button
          className="edit-btn"
          onClick={() => updateStatus(order.orderId, "Preparing")}
        >
          Start Preparing
        </button>
      )}

      {order.orderStatus === "Preparing" && (
        <button
          className="save-btn"
          onClick={() => updateStatus(order.orderId, "Ready")}
        >
          Mark Ready
        </button>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Chef Dashboard</h2>
        <p>Manage kitchen orders and food preparation workflow.</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Pending Orders</h3>
          <p>{pendingOrders.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Preparing</h3>
          <p>{preparingOrders.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Ready To Serve</h3>
          <p>{readyOrders.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Kitchen Status</h3>
          <p>Active</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div>
          <h3>Pending</h3>
          {pendingOrders.length === 0 ? (
            <div className="dashboard-panel">
              <p>No pending orders.</p>
            </div>
          ) : (
            pendingOrders.map(renderOrderCard)
          )}
        </div>

        <div>
          <h3>Preparing</h3>
          {preparingOrders.length === 0 ? (
            <div className="dashboard-panel">
              <p>No preparing orders.</p>
            </div>
          ) : (
            preparingOrders.map(renderOrderCard)
          )}
        </div>
      </div>

      <div>
        <h3>Ready To Serve</h3>

        {readyOrders.length === 0 ? (
          <div className="dashboard-panel">
            <p>No ready orders.</p>
          </div>
        ) : (
          readyOrders.map(renderOrderCard)
        )}
      </div>
    </DashboardLayout>
  );
}

export default ChefDashboard;