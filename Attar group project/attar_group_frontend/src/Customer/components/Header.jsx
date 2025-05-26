import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { FiShoppingCart } from "react-icons/fi";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const showSearch =
    location.pathname === "/" || location.pathname.startsWith("/products");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        Online Mall
      </div>

      {showSearch && (
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      )}

      <nav className="nav-links">
        <button className="nav-btn" onClick={() => navigate("/products")}>
          Products
        </button>

        <button className="nav-btn" onClick={() => navigate("/cart")}>
          <FiShoppingCart />
          <span className="cart-count">{cartCount}</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
