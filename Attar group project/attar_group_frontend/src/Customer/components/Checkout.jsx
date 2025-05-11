import React, { useState } from "react";
import { useCart } from "../../context/cartContext";
import axios from "../../services/axios";
// import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleOrderSubmit = async () => {
    try {
      const orderData = {
        userInfo,
        cartItems: cart,
      };
      await axios.post("/api/orders", orderData);
      setSuccess("Order placed successfully!");
      clearCart();
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="checkout-page-container">
      <h1>Checkout</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <div className="user-info">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userInfo.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={userInfo.phone}
          onChange={handleInputChange}
        />
        <textarea
          name="address"
          placeholder="Address"
          value={userInfo.address}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleOrderSubmit}>Place Order</button>
    </div>
  );
};

export default CheckoutPage;
