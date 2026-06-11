import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    const response = await api.get("/admin/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOrders(response.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm("Delete this order?")) return;

    await api.delete(`/admin/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchOrders();
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Orders Overview</h2>
        <p>View restaurant orders created by waiters.</p>
      </div>

      <div className="dashboard-panel">
        <h3>Orders</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Type</th>
              <th>Table</th>
              <th>Branch</th>
              <th>Staff</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>#{order.orderId}</td>
                <td>Walk-in</td>
                <td>Table {order.table?.tableNumber}</td>
                <td>{order.branch?.branchName}</td>
                <td>
                  {order.user?.firstName} {order.user?.lastName}
                </td>
                <td>
                  {order.orderItems.map((item: any) => (
                    <div key={item.orderItemId}>
                      {item.quantity}x {item.menuItem.itemName}
                    </div>
                  ))}
                </td>
                <td>{order.orderStatus}</td>
                <td>£{order.totalAmount.toFixed(2)}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteOrder(order.orderId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default OrderManagement;