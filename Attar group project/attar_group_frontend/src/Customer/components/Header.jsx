import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

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
          View Cart
        </button>
        <button className="nav-btn" onClick={() => navigate("/profile")}>
          Profile
        </button>
      </nav>
    </header>
  );
};

export default Header;
