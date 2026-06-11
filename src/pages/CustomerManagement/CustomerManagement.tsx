import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

type Customer = {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(
    null
  );

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchCustomers = async () => {
    const response = await api.get("/admin/customers", { headers });
    setCustomers(response.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/admin/customers", form, { headers });

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    });

    fetchCustomers();
  };

  const handleStartEdit = (customer: Customer) => {
    setEditingCustomerId(customer.customerId);

    setEditForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email || "",
      phoneNumber: customer.phoneNumber || "",
    });
  };

  const handleUpdate = async (customerId: number) => {
    await api.put(
      `/admin/customers/${customerId}`,
      {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
      },
      { headers }
    );

    setEditingCustomerId(null);
    fetchCustomers();
  };

  const handleDelete = async (customerId: number) => {
    if (!window.confirm("Delete customer?")) return;

    await api.delete(`/admin/customers/${customerId}`, { headers });

    fetchCustomers();
  };

  const filteredCustomers = customers.filter((customer) => {
    const text = `${customer.firstName} ${customer.lastName} ${customer.email} ${customer.phoneNumber}`;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Customer Management</h2>
        <p>Manage, search and update Steakz restaurant customers.</p>
      </div>

      <div className="dashboard-panel">
        <h3>Add Customer</h3>

        <form className="user-form" onSubmit={handleCreate}>
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          <button type="submit">Add Customer</button>
        </form>
      </div>

      <div className="dashboard-panel">
        <h3>Customers</h3>

        <div style={{ marginBottom: "20px" }}>
          <input
            placeholder="Search by name, email or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.customerId}>
                {editingCustomerId === customer.customerId ? (
                  <>
                    <td>
                      <input
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleEditChange}
                        placeholder="First Name"
                      />

                      <input
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleEditChange}
                        placeholder="Last Name"
                      />
                    </td>

                    <td>
                      <input
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        placeholder="Email"
                      />
                    </td>

                    <td>
                      <input
                        name="phoneNumber"
                        value={editForm.phoneNumber}
                        onChange={handleEditChange}
                        placeholder="Phone Number"
                      />
                    </td>

                    <td>
                      <button
                        className="save-btn"
                        onClick={() => handleUpdate(customer.customerId)}
                      >
                        Save
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => setEditingCustomerId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      {customer.firstName} {customer.lastName}
                    </td>

                    <td>{customer.email || "N/A"}</td>

                    <td>{customer.phoneNumber || "N/A"}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleStartEdit(customer)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(customer.customerId)}
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

export default CustomerManagement;