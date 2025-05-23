import React, { useEffect, useState } from "react";
import { fetchDeliveries, updateDelivery } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/DeliveryManagement.css";

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState("");
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [updatedDelivery, setUpdatedDelivery] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        const response = await fetchDeliveries();
        setDeliveries(response.data.deliveries);
      } catch (err) {
        console.error("Error fetching deliveries:", err);
        setError("Failed to load deliveries.");
      }
    };

    loadDeliveries();
  }, []);

  const handleEditDelivery = async (id) => {
    try {
      await updateDelivery(id, updatedDelivery);
      setDeliveries(
        deliveries.map((delivery) =>
          delivery.id === id ? { ...delivery, ...updatedDelivery } : delivery
        )
      );
      setEditingDelivery(null);
      setUpdatedDelivery({});
    } catch (err) {
      console.error("Error updating delivery:", err);
      setError("Failed to update delivery.");
    }
  };

  return (
    <div className="delivery-management-container">
      <div className="header">
        <h1>Manage Deliveries</h1>
        <button className="btn-back" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}

      <table className="delivery-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Order ID</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Tracking Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(deliveries) &&
            deliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td>{delivery.id}</td>
                <td>{delivery.order_id}</td>
                <td>
                  {editingDelivery === delivery.id ? (
                    <input
                      type="text"
                      value={updatedDelivery.address || delivery.address}
                      onChange={(e) =>
                        setUpdatedDelivery({
                          ...updatedDelivery,
                          address: e.target.value,
                        })
                      }
                    />
                  ) : (
                    delivery.address
                  )}
                </td>
                <td>
                  {editingDelivery === delivery.id ? (
                   <input
                   type="text"
                   value={updatedDelivery.phone ?? ""}
                   onChange={(e) =>
                     setUpdatedDelivery({ ...updatedDelivery, phone: e.target.value })
                   }
                   placeholder="Enter phone"
                 />
                  ) : (
                    delivery.phone || "N/A"
                  )}
                </td>
                <td>
                  {editingDelivery === delivery.id ? (
                    <select
                      value={updatedDelivery.status || delivery.status}
                      onChange={(e) =>
                        setUpdatedDelivery({
                          ...updatedDelivery,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  ) : (
                    delivery.status
                  )}
                </td>
                <td>
                  {editingDelivery === delivery.id ? (
                   <input
                   type="text"
                   value={updatedDelivery.tracking_number ?? ""}
                   onChange={(e) =>
                     setUpdatedDelivery({
                       ...updatedDelivery,
                       tracking_number: e.target.value,
                     })
                   }
                   placeholder="Enter tracking number"
                 />
                  ) : (
                    delivery.tracking_number || "N/A"
                  )}
                </td>
                <td>
                  {editingDelivery === delivery.id ? (
                    <button onClick={() => handleEditDelivery(delivery.id)}>Save</button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingDelivery(delivery.id);
                        setUpdatedDelivery(delivery);
                      }}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryManagement;
