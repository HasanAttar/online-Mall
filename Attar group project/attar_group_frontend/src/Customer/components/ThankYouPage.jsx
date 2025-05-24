import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import "../styles/ThankYouPage.css";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, email } = location.state || {};

  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <FiCheckCircle className="icon" />
        <h1>Thank you for your order!</h1>
        {orderId && <p>Your order ID is <strong>#{orderId}</strong>.</p>}
        {email && <p>A confirmation email was sent to <strong>{email}</strong>.</p>}
        <div className="actions">
          <button onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
          <button onClick={() => navigate("/")}>
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
