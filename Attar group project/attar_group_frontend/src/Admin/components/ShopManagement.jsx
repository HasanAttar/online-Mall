import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchShops,
  addShop,
  deleteShop,
  updateShop,
} from "../../services/api";
import "../styles/ShopManagement.css";

const ShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [error, setError] = useState("");
  const [newShop, setNewShop] = useState({ name: "", description: "", owner_id: "" });
  const [editShop, setEditShop] = useState(null);
  const navigate = useNavigate();

  // Load shops
  useEffect(() => {
    const loadShops = async () => {
      try {
        const response = await fetchShops();
        const shopData = response.data.shops || [];
        setShops(shopData.sort((a, b) => a.id - b.id)); // Sort by ID
      } catch (err) {
        console.error("Error fetching shops:", err);
        setError("Failed to load shops.");
      }
    };

    loadShops();
  }, []);

  // Add shop
  const handleAddShop = async (e) => {
    e.preventDefault();
    const payload = {
      ...newShop,
      name: newShop.name.trim(),
      description: newShop.description.trim(),
      owner_id: Number(newShop.owner_id),
    };

    if (isNaN(payload.owner_id)) {
      return setError("Owner ID must be a valid number.");
    }

    try {
      const response = await addShop(payload);
      setShops([...shops, response.data]);
      setNewShop({ name: "", description: "", owner_id: "" });
      setError("");
    } catch (err) {
      console.error("Error adding shop:", err);
      setError("Failed to add shop.");
    }
  };

  // Delete shop
  const handleDeleteShop = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this shop?");
    if (!confirm) return;

    try {
      await deleteShop(id);
      setShops(shops.filter((shop) => shop.id !== id));
      setError("");
    } catch (err) {
      console.error("Error deleting shop:", err);
      setError("Failed to delete shop.");
    }
  };

  // Edit shop (set selected)
  const handleEditShop = (shop) => {
    setEditShop(shop);
    setError("");
  };

  // Update shop
  const handleUpdateShop = async (e) => {
    e.preventDefault();
    const payload = {
      ...editShop,
      name: editShop.name.trim(),
      description: editShop.description.trim(),
      owner_id: Number(editShop.owner_id),
    };

    if (isNaN(payload.owner_id)) {
      return setError("Owner ID must be a valid number.");
    }

    try {
      await updateShop(payload.id, payload);
      setShops(shops.map((shop) => (shop.id === payload.id ? payload : shop)));
      setEditShop(null);
      setError("");
    } catch (err) {
      console.error("Error updating shop:", err);
      setError("Failed to update shop.");
    }
  };

  return (
    <div className="admin-shops-container">
      <div className="header">
        <h1>Manage Shops</h1>
        <button className="btn-back" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-responsive">
        <table className="shops-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Owner ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(shops) &&
              shops.map((shop) => (
                <tr key={shop.id}>
                  <td>{shop.id}</td>
                  <td>{shop.name}</td>
                  <td>{shop.description}</td>
                  <td>{shop.owner_id}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEditShop(shop)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteShop(shop.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="form-container">
        {editShop ? (
          <form onSubmit={handleUpdateShop}>
            <h3>Edit Shop</h3>
            <input
              type="text"
              placeholder="Name"
              value={editShop.name}
              onChange={(e) => setEditShop({ ...editShop, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={editShop.description}
              onChange={(e) => setEditShop({ ...editShop, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Owner ID"
              value={editShop.owner_id}
              onChange={(e) => setEditShop({ ...editShop, owner_id: e.target.value })}
              required
            />
            <button type="submit">Update Shop</button>
            <button type="button" onClick={() => setEditShop(null)}>
              Cancel
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddShop}>
            <h3>Add New Shop</h3>
            <input
              type="text"
              placeholder="Name"
              value={newShop.name}
              onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newShop.description}
              onChange={(e) => setNewShop({ ...newShop, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Owner ID"
              value={newShop.owner_id}
              onChange={(e) => setNewShop({ ...newShop, owner_id: e.target.value })}
              required
            />
            <button type="submit">Add Shop</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShopManagement;
