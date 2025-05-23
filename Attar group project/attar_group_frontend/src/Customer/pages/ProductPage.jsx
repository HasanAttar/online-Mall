import React, { useEffect, useState } from "react";
import { fetchProducts, fetchCategories } from "../../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ProductPage.css";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProducts(productsResponse.data.products);
        setCategories(categoriesResponse.data.categories);

        const categoryId = searchParams.get("category");
        if (categoryId) setSelectedCategory(categoryId);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [searchParams]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === parseInt(selectedCategory))
    : products;

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="product-page-container">
      <div className="product-hero-banner">
        <div className="hero-overlay">
          <h1>Explore Our Collection</h1>
          <p>Thousands of products in supermarket, fashion & electronics</p>
        </div>
      </div>

      <div className="filter-bar">
        <label htmlFor="category-filter">Category:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <span className="results-count">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
        </span>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleProductClick(product.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="product-image-container">
                    <img
                      src={product.image_url || "/placeholder-product.png"}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                    />
                    <div className="product-badge">
                      {product.is_new && <span className="new-badge">New</span>}
                      {product.discount > 0 && (
                        <span className="discount-badge">-{product.discount}%</span>
                      )}
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-price">
                      {product.discount > 0 ? (
                        <>
                          <span className="original-price">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          <span className="discounted-price">
                            ${(Number(product.price) * (1 - product.discount / 100)).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span>${Number(product.price).toFixed(2)}</span>
                      )}
                    </div>
                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${i < Math.floor(product.rating || 0) ? "filled" : ""}`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="rating-count">({product.review_count || 0})</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <img src="/empty-products.svg" alt="No products found" />
              <h3>No products found</h3>
              <p>Try changing your filter or check back later.</p>
              <button onClick={() => setSelectedCategory("")}>Reset Filters</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;
