import React, { useEffect, useState } from "react";
import { fetchPayments, updatePayment } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/PaymentManagement.css";

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await fetchPayments();
        setPayments(response.data.payments);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payments.");
      }
    };

    loadPayments();
  }, []);

  const handleUpdatePayment = async (id) => {
    try {
      console.log("Updating payment:", { id, newStatus }); // Add this
      await updatePayment(id, { status: newStatus });
      setPayments(
        payments.map((payment) =>
          payment.id === id ? { ...payment, status: newStatus } : payment
        )
      );
      setSelectedPayment(null);
      setNewStatus("");
    } catch (err) {
      console.error("Error updating payment status:", err);
      setError("Failed to update payment status.");
    }
  };
  

  return (
    <div className="payment-management-container">
      <div className="header">
        <h1>Manage Payments</h1>
        <button className="btn-back" onClick={() => navigate("/admin/dashboard")}>Back to Dashboard</button>
      </div>
      {error && <div className="error-message">{error}</div>}

      <table className="payment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(payments) &&
            payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.order_id}</td>
                <td>${parseFloat(payment.amount).toFixed(2)}</td>
                <td>{payment.payment_method}</td>
                <td>
                  {selectedPayment === payment.id ? (
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  ) : (
                    payment.status
                  )}
                </td>
                <td>
                  {selectedPayment === payment.id ? (
                    <button onClick={() => handleUpdatePayment(payment.id)}>Save</button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedPayment(payment.id);
                        setNewStatus(payment.status);
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

export default PaymentManagement;
