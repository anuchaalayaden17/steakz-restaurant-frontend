import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

type User = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: { roleName: string };
  branch?: { branchName: string };
};

type Role = {
  roleId: number;
  roleName: string;
};

type Branch = {
  branchId: number;
  branchName: string;
};

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    roleId: "",
    branchId: "",
  });

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    roleId: "",
    branchId: "",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchData = async () => {
    const [usersResponse, rolesResponse, branchesResponse] = await Promise.all([
      api.get("/admin/users", { headers }),
      api.get("/admin/roles", { headers }),
      api.get("/admin/branches", { headers }),
    ]);

    setUsers(usersResponse.data);
    setRoles(rolesResponse.data);
    setBranches(branchesResponse.data);
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post(
      "/admin/users",
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
        roleId: Number(form.roleId),
        branchId: Number(form.branchId),
      },
      { headers }
    );

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      roleId: "",
      branchId: "",
    });

    fetchData();
  };

  const handleStartEdit = (user: any) => {
    const role = roles.find((role) => role.roleName === user.role.roleName);
    const branch = branches.find(
      (branch) => branch.branchName === user.branch?.branchName
    );

    setEditingUserId(user.userId);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      roleId: role ? String(role.roleId) : "",
      branchId: branch ? String(branch.branchId) : "",
    });
  };

  const handleUpdateUser = async (userId: number) => {
    await api.put(
      `/admin/users/${userId}`,
      {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        roleId: Number(editForm.roleId),
        branchId: Number(editForm.branchId),
      },
      { headers }
    );

    setEditingUserId(null);
    fetchData();
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    await api.delete(`/admin/users/${userId}`, { headers });

    fetchData();
  };

  const filteredUsers =
    roleFilter === "ALL"
      ? users
      : users.filter((user) => user.role.roleName === roleFilter);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>User Management</h2>
        <p>View, filter and manage Steakz system users.</p>
      </div>

      <div className="dashboard-panel">
        <h3>Create New User</h3>

        <form className="user-form" onSubmit={handleCreateUser}>
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
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          <select name="roleId" value={form.roleId} onChange={handleChange} required>
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.roleId} value={role.roleId}>
                {role.roleName}
              </option>
            ))}
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

          <button type="submit">Create User</button>
        </form>
      </div>

      <div className="dashboard-panel">
        <h3>Users</h3>

        <div style={{ marginBottom: "20px" }}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            {roles.map((role) => (
              <option key={role.roleId} value={role.roleName}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Branch</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.userId}>
                {editingUserId === user.userId ? (
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
                      <select
                        name="roleId"
                        value={editForm.roleId}
                        onChange={handleEditChange}
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role.roleId} value={role.roleId}>
                            {role.roleName}
                          </option>
                        ))}
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
                      <input
                        name="phoneNumber"
                        value={editForm.phoneNumber}
                        onChange={handleEditChange}
                        placeholder="Phone"
                      />
                    </td>

                    <td>
                      <button
                        className="save-btn"
                        onClick={() => handleUpdateUser(user.userId)}
                      >
                        Save
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => setEditingUserId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role.roleName}</td>
                    <td>{user.branch?.branchName || "No branch"}</td>
                    <td>{user.phoneNumber || "N/A"}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleStartEdit(user)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.userId)}
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

export default UserManagement;