import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function CashierDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const [selectedMethods, setSelectedMethods] = useState<Record<number, string>>(
    {}
  );

  const [selectedStatuses, setSelectedStatuses] = useState<
    Record<number, string>
  >({});

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    const [ordersResponse, paymentsResponse] = await Promise.all([
      api.get("/cashier/orders", { headers }),
      api.get("/cashier/payments", { headers }),
    ]);

    setOrders(ordersResponse.data);
    setPayments(paymentsResponse.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const processPayment = async (orderId: number) => {
    const paymentMethod = selectedMethods[orderId] || "Cash";
    const paymentStatus = selectedStatuses[orderId] || "Paid";

    await api.post(
      "/cashier/payments",
      {
        orderId,
        paymentMethod,
        paymentStatus,
      },
      { headers }
    );

    fetchData();
  };

  const loadReceipt = async (paymentId: number) => {
    const response = await api.get(`/cashier/receipts/${paymentId}`, {
      headers,
    });

    setSelectedReceipt(response.data);
  };

  const exportReceiptPDF = () => {
    if (!selectedReceipt) return;

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Steakz Restaurant", 20, 20);

    doc.setFontSize(14);
    doc.text("Customer Receipt", 20, 30);

    doc.setFontSize(11);
    doc.text(`Payment ID: #${selectedReceipt.paymentId}`, 20, 45);
    doc.text(`Order ID: #${selectedReceipt.order.orderId}`, 20, 53);
    doc.text(
      `Table: ${selectedReceipt.order.table?.tableNumber || "N/A"}`,
      20,
      61
    );
    doc.text(`Payment Method: ${selectedReceipt.paymentMethod}`, 20, 69);
    doc.text(`Payment Status: ${selectedReceipt.paymentStatus}`, 20, 77);

    doc.line(20, 85, 190, 85);

    doc.setFontSize(13);
    doc.text("Items", 20, 95);

    let y = 105;

    selectedReceipt.order.orderItems.forEach((item: any) => {
      doc.setFontSize(11);
      doc.text(
        `${item.quantity}x ${item.menuItem.itemName} - £${Number(
          item.subtotal
        ).toFixed(2)}`,
        20,
        y
      );
      y += 8;
    });

    doc.line(20, y + 5, 190, y + 5);

    doc.setFontSize(14);
    doc.text(
      `Total: £${Number(selectedReceipt.amount).toFixed(2)}`,
      20,
      y + 18
    );

    doc.setFontSize(10);
    doc.text("Thank you for dining with Steakz.", 20, y + 32);

    doc.save(`receipt-payment-${selectedReceipt.paymentId}.pdf`);
  };

  const completedOrders = orders.filter(
    (order) => order.orderStatus === "Completed"
  );

  const paidOrders = orders.filter((order) => order.orderStatus === "Paid");

  const successfulPayments = payments.filter(
    (payment) => payment.paymentStatus === "Paid"
  );

  const todaySales = successfulPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0
  );

  const pendingBills = completedOrders.length;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Cashier Dashboard</h2>
        <p>Process payments, manage bills and generate customer receipts.</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Sales</h3>
          <p>£{todaySales.toFixed(2)}</p>
        </div>

        <div className="dashboard-card">
          <h3>Transactions</h3>
          <p>{payments.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Pending Bills</h3>
          <p>{pendingBills}</p>
        </div>

        <div className="dashboard-card">
          <h3>Paid Orders</h3>
          <p>{paidOrders.length}</p>
        </div>
      </div>

      <div className="dashboard-panel">
        <h3>Completed Orders Awaiting Payment</h3>

        {completedOrders.length === 0 ? (
          <p>No completed orders awaiting payment.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Table</th>
                <th>Items</th>
                <th>Total</th>
                <th>Method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {completedOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>#{order.orderId}</td>
                  <td>Table {order.table?.tableNumber}</td>

                  <td>
                    {order.orderItems.map((item: any) => (
                      <div key={item.orderItemId}>
                        {item.quantity}x {item.menuItem.itemName}
                      </div>
                    ))}
                  </td>

                  <td>£{Number(order.totalAmount).toFixed(2)}</td>

                  <td>
                    <select
                      value={selectedMethods[order.orderId] || "Cash"}
                      onChange={(e) =>
                        setSelectedMethods({
                          ...selectedMethods,
                          [order.orderId]: e.target.value,
                        })
                      }
                    >
                      <option>Cash</option>
                      <option>Card</option>
                      <option>Mobile Payment</option>
                    </select>
                  </td>

                  <td>
                    <select
                      value={selectedStatuses[order.orderId] || "Paid"}
                      onChange={(e) =>
                        setSelectedStatuses({
                          ...selectedStatuses,
                          [order.orderId]: e.target.value,
                        })
                      }
                    >
                      <option>Paid</option>
                      <option>Failed</option>
                      <option>Denied</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="save-btn"
                      onClick={() => processPayment(order.orderId)}
                    >
                      Process Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-panel">
        <h3>Recent Payments</h3>

        {payments.length === 0 ? (
          <p>No payments processed yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment</th>
                <th>Order</th>
                <th>Table</th>
                <th>Method</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Receipt</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.paymentId}>
                  <td>#{payment.paymentId}</td>
                  <td>#{payment.orderId}</td>
                  <td>Table {payment.order?.table?.tableNumber}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.paymentStatus}</td>
                  <td>£{Number(payment.amount).toFixed(2)}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => loadReceipt(payment.paymentId)}
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedReceipt && (
        <div className="dashboard-panel">
          <h3>Receipt</h3>

          <div
            style={{
              maxWidth: "520px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "24px",
              background: "#ffffff",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h2 style={{ marginBottom: "4px" }}>🥩 Steakz</h2>
              <p style={{ color: "#6b7280" }}>Customer Receipt</p>
            </div>

            <div style={{ marginBottom: "16px", lineHeight: "1.8" }}>
              <p>
                <strong>Payment ID:</strong> #{selectedReceipt.paymentId}
              </p>
              <p>
                <strong>Order ID:</strong> #{selectedReceipt.order.orderId}
              </p>
              <p>
                <strong>Table:</strong>{" "}
                {selectedReceipt.order.table?.tableNumber || "N/A"}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {selectedReceipt.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong> {selectedReceipt.paymentStatus}
              </p>
            </div>

            <hr />

            <h4 style={{ marginTop: "16px" }}>Items</h4>

            <div style={{ marginTop: "10px" }}>
              {selectedReceipt.order.orderItems.map((item: any) => (
                <div
                  key={item.orderItemId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span>
                    {item.quantity}x {item.menuItem.itemName}
                  </span>
                  <span>£{Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "18px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              <span>Total</span>
              <span>£{Number(selectedReceipt.amount).toFixed(2)}</span>
            </div>

            <p
              style={{
                marginTop: "20px",
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              Thank you for dining with Steakz.
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="save-btn" onClick={exportReceiptPDF}>
                Export PDF Receipt
              </button>

              <button
                className="delete-btn"
                onClick={() => setSelectedReceipt(null)}
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default CashierDashboard;