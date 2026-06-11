import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <Navbar />
        <section className="dashboard-content">{children}</section>
      </main>
    </div>
  );
}

export default DashboardLayout;