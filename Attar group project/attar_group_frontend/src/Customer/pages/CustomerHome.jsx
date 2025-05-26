import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchProducts } from "../../services/api";
import { motion } from "framer-motion";
import "../styles/CustomerHome.css";
const BASE_URL = import.meta.env.VITE_API_URL;

const CategoryCard = ({ category, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className="category-card"
    onClick={() => onClick(category.id)}
  >
   <img
  src={
    category.image_url
      ? `${BASE_URL}${category.image_url}`
      : "/default-category.jpg"
  }
  alt={category.name}
  className="category-image"
/>

    <h3 className="category-title">{category.name}</h3>
  </motion.div>
);

const ProductCard = ({ product, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="product-card"
    onClick={() => onClick(product.id)}
  >
    <img
      src={product.image_url || "/placeholder-product.png"}
      alt={product.name}
      className="product-image"
    />
    <div className="product-info">
      <h4>{product.name}</h4>
      <p>${parseFloat(product.price).toFixed(2)}</p>
    </div>
  </motion.div>
);

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);

        setCategories(categoryRes.data.categories || []);

        // Pick 4 random products from the fetched list
        const allProducts = productRes.data.products || [];
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        setRandomProducts(shuffled.slice(0, 4)); // Show 4
      } catch (err) {
        console.error("Error loading home data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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

      {/* Categories */}
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

      {/* ✅ Random Products */}
      {!loading && randomProducts.length > 0 && (
        <section className="random-products">
          <h2>Recommended For You</h2>
          <div className="products-grid">
            {randomProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={handleProductClick} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
