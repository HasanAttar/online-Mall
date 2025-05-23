import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchShops, addShop, deleteShop, updateShop } from "../../services/api";
import "../styles/ShopManagement.css";

const ShopManagement = () => {
    const [shops, setShops] = useState([]);
    const [error, setError] = useState("");
    const [newShop, setNewShop] = useState({ name: "", description: "", owner_id: "" });
    const [editShop, setEditShop] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadShops = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.log("No token found, redirecting to login...");
                    navigate("/admin/login");
                    return;
                }

                console.log("Fetching shops...");
                const response = await fetchShops(); // Fetch the shop data
                const shopData = response.data.shops; // Extract the 'shops' array
                console.log("Shops fetched successfully:", shopData);
                setShops(shopData); // Set the extracted array to 'shops'
            } catch (err) {
                console.error("Error fetching shops:", err);
                setError("Failed to load shops.");
            }
        };

        loadShops();
    }, [navigate]);


    const handleAddShop = async (e) => {
        e.preventDefault();
        try {
            const response = await addShop(newShop);
            setShops([...shops, response.data]);
            setNewShop({ name: "", description: "", owner_id: "" });
        } catch (err) {
            console.error("Error adding shop:", err);
            setError("Failed to add shop.");
        }
    };

    const handleDeleteShop = async (id) => {
        try {
            await deleteShop(id);
            setShops(shops.filter((shop) => shop.id !== id));
        } catch (err) {
            console.error("Error deleting shop:", err);
            setError("Failed to delete shop.");
        }
    };

    const handleEditShop = (shop) => {
        setEditShop(shop);
    };

    const handleUpdateShop = async (e) => {
        e.preventDefault();
        try {
            await updateShop(editShop.id, editShop);
            setShops(
                shops.map((shop) => (shop.id === editShop.id ? editShop : shop))
            );
            setEditShop(null);
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
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDeleteShop(shop.id)}
                                        >
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
                            onChange={(e) =>
                                setEditShop({ ...editShop, description: e.target.value })
                            }
                            required
                        />
                        <input
                            type="number"
                            placeholder="Owner ID"
                            value={editShop.owner_id}
                            onChange={(e) =>
                                setEditShop({ ...editShop, owner_id: e.target.value })
                            }
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
                            onChange={(e) =>
                                setNewShop({ ...newShop, description: e.target.value })
                            }
                            required
                        />
                        <input
                            type="number"
                            placeholder="Owner ID"
                            value={newShop.owner_id}
                            onChange={(e) =>
                                setNewShop({ ...newShop, owner_id: e.target.value })
                            }
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
