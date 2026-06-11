import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

type MenuItem = {
  menuItemId: number;
  itemName: string;
  description: string;
  price: number;
  category: string;
  availabilityStatus: string;
};

function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const menuApi =
    user?.role === "CHEF" ? "/chef/menu-items" : "/admin/menu-items";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [form, setForm] = useState({
    itemName: "",
    description: "",
    price: "",
    category: "",
    availabilityStatus: "Available",
  });

  const [editForm, setEditForm] = useState({
    itemName: "",
    description: "",
    price: "",
    category: "",
    availabilityStatus: "Available",
  });

  const fetchMenuItems = async () => {
    try {
      const response = await api.get(menuApi, { headers });
      setMenuItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
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

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post(
      menuApi,
      {
        itemName: form.itemName,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        availabilityStatus: form.availabilityStatus,
      },
      { headers }
    );

    setForm({
      itemName: "",
      description: "",
      price: "",
      category: "",
      availabilityStatus: "Available",
    });

    fetchMenuItems();
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingItemId(item.menuItemId);

    setEditForm({
      itemName: item.itemName,
      description: item.description || "",
      price: String(item.price),
      category: item.category,
      availabilityStatus: item.availabilityStatus,
    });
  };

  const handleUpdateMenuItem = async (menuItemId: number) => {
    await api.put(
      `${menuApi}/${menuItemId}`,
      {
        itemName: editForm.itemName,
        description: editForm.description,
        price: Number(editForm.price),
        category: editForm.category,
        availabilityStatus: editForm.availabilityStatus,
      },
      { headers }
    );

    setEditingItemId(null);
    fetchMenuItems();
  };

  const handleDelete = async (menuItemId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) return;

    await api.delete(`${menuApi}/${menuItemId}`, { headers });

    fetchMenuItems();
  };

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  const filteredMenuItems =
    categoryFilter === "ALL"
      ? menuItems
      : menuItems.filter((item) => item.category === categoryFilter);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Menu Management</h2>
        <p>Manage, filter and update Steakz restaurant menu items.</p>
      </div>

      <div className="dashboard-panel">
        <h3>Add Menu Item</h3>

        <form className="user-form" onSubmit={handleCreateMenuItem}>
          <input
            name="itemName"
            placeholder="Item Name"
            value={form.itemName}
            onChange={handleChange}
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Starter">Starter</option>
            <option value="Steak">Steak</option>
            <option value="Burger">Burger</option>
            <option value="Main Course">Main Course</option>
            <option value="Dessert">Dessert</option>
            <option value="Drink">Drink</option>
          </select>

          <select
            name="availabilityStatus"
            value={form.availabilityStatus}
            onChange={handleChange}
          >
            <option>Available</option>
            <option>Unavailable</option>
          </select>

          <button type="submit">Add Menu Item</button>
        </form>
      </div>

      <div className="dashboard-panel">
        <h3>Menu Items</h3>

        <div style={{ marginBottom: "20px" }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMenuItems.map((item) => (
              <tr key={item.menuItemId}>
                {editingItemId === item.menuItemId ? (
                  <>
                    <td>
                      <input
                        name="itemName"
                        value={editForm.itemName}
                        onChange={handleEditChange}
                        placeholder="Item Name"
                      />
                    </td>

                    <td>
                      <input
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        placeholder="Description"
                      />
                    </td>

                    <td>
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                      >
                        <option value="Starter">Starter</option>
                        <option value="Steak">Steak</option>
                        <option value="Burger">Burger</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Drink">Drink</option>
                      </select>
                    </td>

                    <td>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={handleEditChange}
                      />
                    </td>

                    <td>
                      <select
                        name="availabilityStatus"
                        value={editForm.availabilityStatus}
                        onChange={handleEditChange}
                      >
                        <option>Available</option>
                        <option>Unavailable</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="save-btn"
                        onClick={() => handleUpdateMenuItem(item.menuItemId)}
                      >
                        Save
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => setEditingItemId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.itemName}</td>
                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>£{item.price.toFixed(2)}</td>
                    <td>{item.availabilityStatus}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleStartEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item.menuItemId)}
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

export default MenuManagement;