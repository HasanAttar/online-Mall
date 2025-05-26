import React, { useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/OrderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchOrders();
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId) => {
    if (!newStatus) {
      setError("Please select a new status.");
      return;
    }

    try {
      await updateOrderStatus(orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setSelectedOrder(null);
      setNewStatus("");
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status.");
    }
  };

  return (
    <div className="order-management-container">
      <div className="header">
        <h1>Manage Orders</h1>
        <button className="btn-back" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="table-responsive">
          <table className="order-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Products</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user_id || "Guest"}</td>
                    <td>
                      {order.products.map((p) => (
                        <div key={p.product_id}>
                          {p.product_name} ({p.quantity})
                        </div>
                      ))}
                    </td>
                    <td>${Number(order.total_price).toFixed(2)}</td>
                    <td>
                      {selectedOrder === order.id ? (
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      ) : (
                        order.status
                      )}
                    </td>
                    <td>{order.payment_method}</td>
                    <td>
                      {selectedOrder === order.id ? (
                        <>
                          <button
                            className="btn-save"
                            onClick={() => handleUpdateStatus(order.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setSelectedOrder(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setSelectedOrder(order.id);
                            setNewStatus(order.status);
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
