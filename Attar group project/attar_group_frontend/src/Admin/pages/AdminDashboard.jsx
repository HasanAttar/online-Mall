import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../../services/auth";
import axios from "../../services/axios";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalSales: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const response = await axios.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data.dashboard);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch stats.");
        if (err.response?.status === 401) {
          removeToken();
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate("/admin/login");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => navigate("/admin/users")}>Manage Users</li>
          <li onClick={() => navigate("/admin/shops")}>Manage Shops</li>
          <li onClick={() => navigate("/admin/products")}>Manage Products</li>
          <li onClick={() => navigate("/admin/categories")}>Manage Categories</li>
          <li onClick={() => navigate("/admin/orders")}>Manage Orders</li>
          <li onClick={() => navigate("/admin/delivery")}>Manage Delivery</li>
          <li onClick={() => navigate("/admin/payment")}>Manage Payments</li>
        </ul>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <h1>Admin Dashboard</h1>
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="admin-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Total Products</h3>
              <p>{stats.totalProducts}</p>
            </div>
            <div className="stat-card">
              <h3>Total Sales</h3>
              <p>${Number(stats.totalSales || 0).toFixed(2)}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
