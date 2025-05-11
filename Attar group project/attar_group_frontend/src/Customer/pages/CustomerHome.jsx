import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../services/api"; // Assume this fetches categories
import { useNavigate } from "react-router-dom";
import "../styles/CustomerHome.css";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data.categories); // Adjust based on API response
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/products?category=${categoryId}`); // Navigate to the Product Page
  };

  return (
    <div className="home-container">
      <h1>Welcome to Our Online Store</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="categories">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(category.id)}
          >
            <h2>{category.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
