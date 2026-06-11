import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function TableManagement() {
  const [tables, setTables] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [editingTableId, setEditingTableId] = useState<number | null>(null);

  const [form, setForm] = useState({
    tableNumber: "",
    capacity: "",
    status: "Available",
    branchId: "",
  });

  const [editForm, setEditForm] = useState({
    tableNumber: "",
    capacity: "",
    status: "Available",
    branchId: "",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    const [tablesResponse, branchesResponse] = await Promise.all([
      api.get("/admin/tables", { headers }),
      api.get("/admin/branches", { headers }),
    ]);

    setTables(tablesResponse.data);
    setBranches(branchesResponse.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post(
      "/admin/tables",
      {
        tableNumber: Number(form.tableNumber),
        capacity: Number(form.capacity),
        status: form.status,
        branchId: Number(form.branchId),
      },
      { headers }
    );

    setForm({
      tableNumber: "",
      capacity: "",
      status: "Available",
      branchId: "",
    });

    fetchData();
  };

  const handleStartEdit = (table: any) => {
    setEditingTableId(table.tableId);

    setEditForm({
      tableNumber: String(table.tableNumber),
      capacity: String(table.capacity),
      status: table.status,
      branchId: String(table.branchId),
    });
  };

  const handleUpdate = async (tableId: number) => {
    await api.put(
      `/admin/tables/${tableId}`,
      {
        tableNumber: Number(editForm.tableNumber),
        capacity: Number(editForm.capacity),
        status: editForm.status,
        branchId: Number(editForm.branchId),
      },
      { headers }
    );

    setEditingTableId(null);
    fetchData();
  };

  const handleDelete = async (tableId: number) => {
    if (!window.confirm("Delete this table?")) return;

    await api.delete(`/admin/tables/${tableId}`, { headers });

    fetchData();
  };

  const filteredTables =
    branchFilter === "ALL"
      ? tables
      : tables.filter((table) => table.branch?.branchName === branchFilter);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Table Management</h2>
        <p>Manage, filter and update restaurant tables.</p>
      </div>

      <div className="dashboard-panel">
        <h3>Add Table</h3>

        <form className="user-form" onSubmit={handleCreate}>
          <input
            name="tableNumber"
            type="number"
            placeholder="Table Number"
            value={form.tableNumber}
            onChange={handleChange}
            required
          />

          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            required
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option>Available</option>
            <option>Occupied</option>
            <option>Reserved</option>
          </select>

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

          <button type="submit">Add Table</button>
        </form>
      </div>

      <div className="dashboard-panel">
        <h3>Restaurant Tables</h3>

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
              <th>Table</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Branch</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTables.map((table) => (
              <tr key={table.tableId}>
                {editingTableId === table.tableId ? (
                  <>
                    <td>
                      <input
                        name="tableNumber"
                        type="number"
                        value={editForm.tableNumber}
                        onChange={handleEditChange}
                      />
                    </td>

                    <td>
                      <input
                        name="capacity"
                        type="number"
                        value={editForm.capacity}
                        onChange={handleEditChange}
                      />
                    </td>

                    <td>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                      >
                        <option>Available</option>
                        <option>Occupied</option>
                        <option>Reserved</option>
                      </select>
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
                        onClick={() => handleUpdate(table.tableId)}
                      >
                        Save
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => setEditingTableId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{table.tableNumber}</td>
                    <td>{table.capacity}</td>
                    <td>{table.status}</td>
                    <td>{table.branch?.branchName}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleStartEdit(table)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(table.tableId)}
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

export default TableManagement;