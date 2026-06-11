import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

type CartItem = {
  menuItemId: number;
  itemName: string;
  price: number;
  quantity: number;
};

function WaiterDashboard() {
  const [tables, setTables] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedTableId, setSelectedTableId] = useState("");
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const normalizeCategory = (category: string) => {
    switch (category) {
      case "Steaks":
        return "Steak";
      case "Burgers":
        return "Burger";
      case "Desserts":
        return "Dessert";
      case "Sides":
        return "Starter";
      default:
        return category;
    }
  };

  const fetchData = async () => {
    const [tablesRes, menuRes, ordersRes] = await Promise.all([
      api.get("/waiter/tables", { headers }),
      api.get("/waiter/menu-items", { headers }),
      api.get("/waiter/orders", { headers }),
    ]);

    setTables(tablesRes.data);
    setMenuItems(menuRes.data);
    setOrders(ordersRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categories = [
    "Starter",
    "Main Course",
    "Steak",
    "Burger",
    "Dessert",
    "Drink",
  ].filter((category) =>
    menuItems.some((item) => normalizeCategory(item.category) === category)
  );

  const filteredMenuItems =
    categoryFilter === "ALL"
      ? menuItems
      : menuItems.filter(
          (item) => normalizeCategory(item.category) === categoryFilter
        );

  const addItemToCart = () => {
    if (!selectedMenuItemId) {
      alert("Select a menu item.");
      return;
    }

    const selectedItem = menuItems.find(
      (item) => item.menuItemId === Number(selectedMenuItemId)
    );

    if (!selectedItem) return;

    if (selectedItem.stock <= 0) {
      alert(`${selectedItem.itemName} is out of stock`);
      return;
    }

    if (Number(quantity) <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    const existingItem = cart.find(
      (item) => item.menuItemId === selectedItem.menuItemId
    );

    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentCartQuantity + Number(quantity);

    if (newTotalQuantity > selectedItem.stock) {
      alert(`Only ${selectedItem.stock} ${selectedItem.itemName} available.`);
      return;
    }

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.menuItemId === selectedItem.menuItemId
            ? { ...item, quantity: newTotalQuantity }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          menuItemId: selectedItem.menuItemId,
          itemName: selectedItem.itemName,
          price: selectedItem.price,
          quantity: Number(quantity),
        },
      ]);
    }

    setSelectedMenuItemId("");
    setQuantity("1");
  };

  const removeItemFromCart = (menuItemId: number) => {
    setCart(cart.filter((item) => item.menuItemId !== menuItemId));
  };

  const orderTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const sendOrderToKitchen = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!selectedTableId) {
        alert("Please select a table.");
        return;
      }

      if (cart.length === 0) {
        alert("Please add at least one menu item.");
        return;
      }

      const response = await api.post(
        "/waiter/orders",
        {
          tableId: Number(selectedTableId),
          items: cart.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        },
        { headers }
      );

      alert(response.data.message || "Order sent to kitchen successfully!");

      setSelectedTableId("");
      setSelectedMenuItemId("");
      setQuantity("1");
      setCategoryFilter("ALL");
      setCart([]);

      fetchData();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to send order.");
    }
  };

  const deliverOrder = async (orderId: number) => {
    try {
      const response = await api.patch(
        `/waiter/orders/${orderId}/deliver`,
        {},
        { headers }
      );

      alert(response.data.message || "Order delivered successfully.");
      fetchData();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to deliver order.");
    }
  };

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "Pending"
  );

  const readyOrders = orders.filter((order) => order.orderStatus === "Ready");

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Waiter POS</h2>
        <p>
          Create table orders, send them to the kitchen and deliver ready
          orders.
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Tables</h3>
          <p>{tables.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Pending Orders</h3>
          <p>{pendingOrders.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Ready Orders</h3>
          <p>{readyOrders.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Cart Items</h3>
          <p>{cart.length}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h3>Create Order</h3>

          <form className="user-form" onSubmit={sendOrderToKitchen}>
            <select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              required
            >
              <option value="">Select Table</option>
              {tables.map((table) => (
                <option key={table.tableId} value={table.tableId}>
                  Table {table.tableNumber} - {table.status}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSelectedMenuItemId("");
              }}
            >
              <option value="ALL">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedMenuItemId}
              onChange={(e) => setSelectedMenuItemId(e.target.value)}
            >
              <option value="">Select Menu Item</option>
              {filteredMenuItems.map((item) => (
                <option
                  key={item.menuItemId}
                  value={item.menuItemId}
                  disabled={item.stock <= 0}
                >
                  {item.itemName} - £{Number(item.price).toFixed(2)} | Stock:{" "}
                  {item.stock} | {item.stockStatus}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <button type="button" onClick={addItemToCart}>
              Add Item
            </button>

            <div className="order-total-box">
              Order Total: £{orderTotal.toFixed(2)}
            </div>

            <button type="submit">Send Order to Kitchen</button>
          </form>
        </div>

        <div className="dashboard-panel">
          <h3>Current Order Cart</h3>

          {cart.length === 0 ? (
            <p>No items added yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item) => (
                  <tr key={item.menuItemId}>
                    <td>{item.itemName}</td>
                    <td>{item.quantity}</td>
                    <td>£{(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => removeItemFromCart(item.menuItemId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="dashboard-panel">
        <h3>Ready Orders</h3>

        {readyOrders.length === 0 ? (
          <p>No orders ready yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Table</th>
                <th>Items</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {readyOrders.map((order) => (
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
                    <button
                      className="save-btn"
                      onClick={() => deliverOrder(order.orderId)}
                    >
                      Deliver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-panel">
        <h3>Restaurant Orders</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Table</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
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
                <td>{order.orderStatus}</td>
                <td>£{Number(order.totalAmount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default WaiterDashboard;