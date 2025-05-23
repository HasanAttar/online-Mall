import React, { useState, useEffect } from "react";
import { useCart } from "../../context/cartContext";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import { FiArrowLeft, FiCheck, FiAlertCircle } from "react-icons/fi";
import "../styles/Checkout.css";

const CheckoutPage= () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "credit_card",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      navigate("/cart");
    }
  }, [cart, orderSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email address";
    // if (!phoneRegex.test(formData.phone)) newErrors.phone = "Invalid phone number";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
  return cart.reduce((total, item) => {
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
    return total + (price * item.quantity);
  }, 0);
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const orderData = {
      user_id: 3, // Replace this with dynamic user ID if login is implemented
      payment_method: formData.paymentMethod,
      delivery_address: formData.address,
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price),
      })),
    };

    console.log("Sending orderData:", orderData); // ✅ DEBUGGING

    const response = await axios.post("/api/orders", orderData);
    setOrderId(response.data.order_id); // updated to match backend key
    setOrderSuccess(true);
    clearCart();
  } catch (err) {
    console.error("Order submission error:", err);
    setErrors({
      ...errors,
      submit:
        err.response?.data?.message ||
        "Failed to place order. Please try again.",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  if (orderSuccess) {
    return (
      <div className="order-success-container">
        <div className="success-card">
          <FiCheck className="success-icon" />
          <h2>Order Placed Successfully!</h2>
          <p>Your order ID: #{orderId}</p>
          <p>We've sent a confirmation to {formData.email}</p>
          <button 
            className="btn-continue-shopping"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
          <button 
            className="btn-view-order"
            onClick={() => navigate(`/orders/${orderId}`)}
          >
            View Order Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <button 
        className="btn-back-to-cart"
        onClick={() => navigate("/cart")}
      >
        <FiArrowLeft /> Back to Cart
      </button>

      <div className="checkout-grid">
        {/* Customer Information */}
        <div className="checkout-form-section">
          <h2>Customer Information</h2>
          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && (
                <span className="error-message">
                  <FiAlertCircle /> {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <span className="error-message">
                  <FiAlertCircle /> {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && (
                <span className="error-message">
                  <FiAlertCircle /> {errors.phone}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address">Shipping Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="4"
                className={errors.address ? "input-error" : ""}
              />
              {errors.address && (
                <span className="error-message">
                  <FiAlertCircle /> {errors.address}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash_on_delivery">Cash on Delivery</option>
              </select>
            </div>
               <button
          type="submit"
          className="btn-place-order"
          disabled={isSubmitting || cart.length === 0}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="order-items">
        // In your order items mapping
{cart.map((item) => (
  <div key={item.id} className="order-item">
    <img 
      src={item.image_url || "/placeholder-product.png"} 
      alt={item.name} 
      className="item-image"
    />
    <div className="item-details">
      <h3>{item.name}</h3>
      <p>
        ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'} × {item.quantity}
      </p>
    </div>
    <div className="item-total">
      ${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
    </div>
  </div>
))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {errors.submit && (
            <div className="submit-error">
              <FiAlertCircle /> {errors.submit}
            </div>
          )}

      
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;