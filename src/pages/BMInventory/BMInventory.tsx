import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

type InventoryItem = {
  inventoryId: number;
  ingredientName: string;
  quantityInStock: number;
  unit: string;
  lastUpdated: string;
};

function BMInventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [restockValues, setRestockValues] = useState<Record<number, string>>(
    {}
  );
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchInventory = async () => {
    try {
      const response = await api.get("/bm/inventory", { headers });
      setInventoryItems(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load branch inventory.");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= 5) return "Low Stock";
    return "In Stock";
  };

  const restockItem = async (item: InventoryItem) => {
    const amountToAdd = Number(restockValues[item.inventoryId] || 0);

    if (amountToAdd <= 0) {
      alert("Enter a valid restock quantity.");
      return;
    }

    const newQuantity = Number(item.quantityInStock) + amountToAdd;

    try {
      await api.patch(
        `/bm/inventory/${item.inventoryId}`,
        {
          quantityInStock: newQuantity,
        },
        { headers }
      );

      setMessage(`${item.ingredientName} restocked successfully.`);
      setRestockValues({
        ...restockValues,
        [item.inventoryId]: "",
      });

      fetchInventory();
    } catch (error) {
      console.error(error);
      setMessage("Failed to restock item.");
    }
  };

  const setOutOfStock = async (item: InventoryItem) => {
    try {
      await api.patch(
        `/bm/inventory/${item.inventoryId}`,
        {
          quantityInStock: 0,
        },
        { headers }
      );

      setMessage(`${item.ingredientName} marked as out of stock.`);
      fetchInventory();
    } catch (error) {
      console.error(error);
      setMessage("Failed to update stock.");
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Inventory Management</h2>
        <p>Monitor low stock items and restock branch inventory.</p>
      </div>

      {message && (
        <div className="dashboard-panel">
          <p>{message}</p>
        </div>
      )}

      <div className="dashboard-panel">
        <h3>Branch Inventory</h3>

        {inventoryItems.length === 0 ? (
          <p>No inventory items found for this branch.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Current Stock</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Restock Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.inventoryId}>
                  <td>{item.ingredientName}</td>
                  <td>{Number(item.quantityInStock)}</td>
                  <td>{item.unit}</td>
                  <td>{getStockStatus(Number(item.quantityInStock))}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 10"
                      value={restockValues[item.inventoryId] || ""}
                      onChange={(e) =>
                        setRestockValues({
                          ...restockValues,
                          [item.inventoryId]: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="save-btn"
                      onClick={() => restockItem(item)}
                    >
                      Restock
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => setOutOfStock(item)}
                    >
                      Mark Out Of Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default BMInventory;