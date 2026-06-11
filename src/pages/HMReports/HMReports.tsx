import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function HMReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = localStorage.getItem("token");

  const fetchReports = async () => {
    try {
      const response = await api.get("/hm/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate,
          endDate,
        },
      });

      setReports(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h2>HQ Reports</h2>
        <p>
          Generate multi-branch reports, compare branch performance and filter
          performance by date.
        </p>
      </div>

      <div className="dashboard-panel">
        <h3>Filter Reports By Date</h3>

        <div className="user-form">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button type="button" onClick={fetchReports}>
            Generate Report
          </button>
        </div>
      </div>

      <div className="dashboard-panel">
        <h3>Multi-Branch Report</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Branch</th>
              <th>Location</th>
              <th>Orders</th>
              <th>Paid Orders</th>
              <th>Revenue</th>
              <th>Staff</th>
              <th>Inventory</th>
              <th>Tables</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((branch: any) => (
              <tr key={branch.branchId}>
                <td>{branch.branchName}</td>
                <td>{branch.location}</td>
                <td>{branch.totalOrders}</td>
                <td>{branch.paidOrders}</td>
                <td>£{Number(branch.totalRevenue).toFixed(2)}</td>
                <td>{branch.totalStaff}</td>
                <td>{branch.inventoryItems}</td>
                <td>{branch.tables}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default HMReports;