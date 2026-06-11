import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function InventoryManagement() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [editingInventoryId, setEditingInventoryId] = useState<number | null>(
    null
  );

  const [form, setForm] = useState({
    ingredientName: "",
    quantityInStock: "",
    unit: "",
    branchId: "",
  });

  const [editForm, setEditForm] = useState({
    ingredientName: "",
    quantityInStock: "",
    unit: "",
    branchId: "",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    const [inventoryResponse, branchResponse] = await Promise.all([
      api.get("/admin/inventory", { headers }),
      api.get("/admin/branches", { headers }),
    ]);

    setInventory(inventoryResponse.data);
    setBranches(branchResponse.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post(
      "/admin/inventory",
      {
        ingredientName: form.ingredientName,
        quantityInStock: Number(form.quantityInStock),
        unit: form.unit,
        branchId: Number(form.branchId),
      },
      { headers }
    );

    setForm({
      ingredientName: "",
      quantityInStock: "",
      unit: "",
      branchId: "",
    });

    fetchData();
  };

  const handleStartEdit = (item: any) => {
    setEditingInventoryId(item.inventoryId);

    setEditForm({
      ingredientName: item.ingredientName,
      quantityInStock: String(item.quantityInStock),
      unit: item.unit,
      branchId: String(item.branchId),
    });
  };

  const handleUpdate = async (inventoryId: number) => {
    await api.put(
      `/admin/inventory/${inventoryId}`,
      {
        ingredientName: editForm.ingredientName,
        quantityInStock: Number(editForm.quantityInStock),
        unit: editForm.unit,
        branchId: Number(editForm.branchId),
      },
      { headers }
    );

    setEditingInventoryId(null);
    fetchData();
  };

  const handleDelete = async (inventoryId: number) => {
    if (!window.confirm("Delete this ingredient?")) return;

    await api.delete(`/admin/inventory/${inventoryId}`, { headers });

    fetchData();
  };

  const filteredInventory =
    branchFilter === "ALL"
      ? inventory
      : inventory.filter((item) => item.branch?.branchName === branchFilter);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Inventory Management</h2>
        <p>Manage, filter and update restaurant stock and ingredients.</p>
      </div>

      <div className="dashboard-panel">
        <h3>Add Ingredient</h3>

        <form className="user-form" onSubmit={handleCreate}>
          <input
            name="ingredientName"
            placeholder="Ingredient Name"
            value={form.ingredientName}
            onChange={handleChange}
            required
          />

          <input
            name="quantityInStock"
            type="number"
            step="0.01"
            placeholder="Quantity"
            value={form.quantityInStock}
            onChange={handleChange}
            required
          />

          <input
            name="unit"
            placeholder="Unit (kg, litres, pcs)"
            value={form.unit}
            onChange={handleChange}
            required
          />

          <select
            name="branchId"
            value={form.branchId}
            onChange={handleChange}
            required
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </option>
            ))}
          </select>

          <button type="submit">Add Ingredient</button>
        </form>
      </div>

      <div className="dashboard-panel">
        <h3>Inventory</h3>

        <div style={{ marginBottom: "20px" }}>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="ALL">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.branchId} value={branch.branchName}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Stock</th>
              <th>Unit</th>
              <th>Branch</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.inventoryId}>
                {editingInventoryId === item.inventoryId ? (
                  <>
                    <td>
                      <input
                        name="ingredientName"
                        value={editForm.ingredientName}
                        onChange={handleEditChange}
                      />
                    </td>

                    <td>
                      <input
                        name="quantityInStock"
                        type="number"
                        step="0.01"
                        value={editForm.quantityInStock}
                        onChange={handleEditChange}
                      />
                    </td>

                    <td>
                      <input
                        name="unit"
                        value={editForm.unit}
                        onChange={handleEditChange}
                      />
                    </td>

                    <td>
                      <select
                        name="branchId"
                        value={editForm.branchId}
                        onChange={handleEditChange}
                      >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch.branchId} value={branch.branchId}>
                            {branch.branchName}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button
                        className="save-btn"
                        onClick={() => handleUpdate(item.inventoryId)}
                      >
                        Save
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => setEditingInventoryId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.ingredientName}</td>
                    <td>{item.quantityInStock}</td>
                    <td>{item.unit}</td>
                    <td>{item.branch?.branchName}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleStartEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item.inventoryId)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default InventoryManagement;