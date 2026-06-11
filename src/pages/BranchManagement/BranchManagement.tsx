import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

type Branch = {
  branchId: number;
  branchName: string;
  location: string;
  phoneNumber: string;
};

function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [editForm, setEditForm] = useState({
    branchName: "",
    location: "",
    phoneNumber: "",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchBranches = async () => {
    const response = await api.get("/admin/branches", { headers });
    setBranches(response.data);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleStartEdit = (branch: Branch) => {
    setEditingId(branch.branchId);
    setEditForm({
      branchName: branch.branchName,
      location: branch.location,
      phoneNumber: branch.phoneNumber,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateBranch = async (branchId: number) => {
    await api.put(`/admin/branches/${branchId}`, editForm, { headers });

    setEditingId(null);
    fetchBranches();
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>Branch Management</h2>
        <p>Manage and update Steakz branch information.</p>
      </div>

      <div className="dashboard-panel">
        <h3>Branches</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Branch</th>
              <th>Location</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {branches.map((branch) => (
              <tr key={branch.branchId}>
                {editingId === branch.branchId ? (
                  <>
                    <td>
                      <input
                        name="branchName"
                        value={editForm.branchName}
                        onChange={handleChange}
                      />
                    </td>

                    <td>
                      <input
                        name="location"
                        value={editForm.location}
                        onChange={handleChange}
                      />
                    </td>

                    <td>
                      <input
                        name="phoneNumber"
                        value={editForm.phoneNumber}
                        onChange={handleChange}
                      />
                    </td>

                    <td>
                      <button
                        className="save-btn"
                        onClick={() => handleUpdateBranch(branch.branchId)}
                      >
                        Save
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{branch.branchName}</td>
                    <td>{branch.location}</td>
                    <td>{branch.phoneNumber}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleStartEdit(branch)}
                      >
                        Edit
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

export default BranchManagement;