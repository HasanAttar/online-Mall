import React, { useEffect, useState } from "react";
import { fetchProducts, fetchCategories } from "../../services/api"; // Fetch products and categories
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/ProductPage.css";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProducts(productsResponse.data.products);
        setCategories(categoriesResponse.data.categories);

        // Check for a category in query params
        const categoryId = searchParams.get("category");
        if (categoryId) setSelectedCategory(categoryId);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };

    loadInitialData();
  }, [searchParams]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === parseInt(selectedCategory))
    : products;

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to Product Details
  };

  return (
    <div className="product-page-container">
      <h1>Our Products</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="category-filter">
        <select
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
      </div>

      <div className="products">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => handleProductClick(product.id)}
          >
            <img
              src={product.image_url || "placeholder.png"}
              alt={product.name}
              className="product-image"
            />
            <h2>{product.name}</h2>
            <p>${Number(product.price).toFixed(2) || "0.00"}</p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
