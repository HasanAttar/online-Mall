import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../services/api";
import { motion } from "framer-motion";
import "../styles/CustomerHome.css";

const CategoryCard = ({ category, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className="category-card"
    onClick={() => onClick(category.id)}
  >
    <img
      src={category.image || "/default-category.jpg"}
      alt={category.name}
      className="category-image"
    />
    <h3 className="category-title">{category.name}</h3>
  </motion.div>
);

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await fetchCategories();
        setCategories(data.categories);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-text">
          <h1>Welcome to Our Online Store</h1>
          <p>Explore the best products from top categories</p>
          <button className="shop-now-btn" onClick={() => navigate("/products")}>
            Shop Now
          </button>
        </div>
        <img src="/assets/hero-banner.jpg" alt="Shop Banner" className="hero-image" />
      </section>

      {/* Category Section */}
      <section className="category-section">
        <h2>Shop by Category</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">
            {error} <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} onClick={handleCategoryClick} />
            ))}
          </div>
        )}
      </section>

      {/* Future: Featured Products */}
      {/* <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">...</div>
      </section> */}
    </div>
  );
};

export default Home;
