import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext"; // ✅ Import the cart context
import { FiShoppingCart } from "react-icons/fi"; // ✅ Cart icon
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        Online Mall
      </div>
      <nav className="nav-links">
        <button className="nav-btn" onClick={() => navigate("/products")}>
          Products
        </button>
        <button className="nav-btn" onClick={() => navigate("/cart")}>
          <FiShoppingCart />
          <span className="cart-count">{cartCount}</span>
        </button>
        <button className="nav-btn" onClick={() => navigate("/profile")}>
          Profile
        </button>
      </nav>
    </header>
  );
};

export default Header;
