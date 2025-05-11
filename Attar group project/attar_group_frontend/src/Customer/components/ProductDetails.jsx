import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "../../services/api";
import { useCart } from "../../context/cartContext";
import "../styles/ProductDetails.css";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const response = await fetchProductById(id);
        console.log("Product Details:", response.data);
        const productData = response.data || {};
        productData.price = productData.price || 0;
        productData.stock = productData.stock || 0;
        productData.image_url = productData.image_url || "placeholder.png";
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details.");
      }
    };

    loadProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      });
      console.log("Product added to cart:", product);
    }
  };

  if (error) {
    return (
      <div className="error-page">
        <h1>{error}</h1>
        <button onClick={() => navigate("/products")}>Back to Products</button>
      </div>
    );
  }

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <div className="product-details-container">
      <button className="btn-back" onClick={() => navigate("/products")}>
        Back to Products
      </button>
      <div className="product-details">
        <img
          src={product.image_url}
          alt={product.name || "Product Image"}
          className="product-image"
        />
        <div className="details">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h2>${Number(product.price).toFixed(2)}</h2>
          <p>Stock: {product.stock > 0 ? product.stock : "Out of Stock"}</p>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={product.stock > 0 ? "btn-add-to-cart" : "btn-disabled"}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
