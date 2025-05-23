import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser } from "../../services/api";
import "../styles/UserManagement.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login...");
          navigate("/admin/login");
          return;
        }

        console.log("Fetching users...");
        const response = await fetchUsers();
        const userData = response.data;
        console.log("Users fetched successfully:", userData);
        setUsers(userData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
        if (err.response?.status === 401) {
          console.log("Unauthorized, redirecting to login...");
          navigate("/admin/login");
        }
      }
    };

    loadUsers();
  }, [navigate]);

  const handleDeleteUser = async (id) => {
    try {
      console.log("Deleting user with ID:", id);
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="admin-users-container">
      <div className="header">
        <h1>Manage Users</h1>
        <button className="btn-back" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) &&
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
