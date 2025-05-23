import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "../../services/api";
import { useCart } from "../../context/cartContext";
import { motion } from "framer-motion";
import { FiArrowLeft, FiShoppingCart, FiHeart, FiShare2, FiStar } from "react-icons/fi";
import "../styles/ProductDetails.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchProductById(id);
        const productData = response.data || {};
        
        // Set default values if missing
        const processedProduct = {
          id: productData.id,
          name: productData.name || "Unnamed Product",
          description: productData.description || "No description available",
          price: productData.price || 0,
          discount: productData.discount || 0,
          stock: productData.stock || 0,
          rating: productData.rating || 0,
          reviewCount: productData.reviewCount || 0,
          images: productData.images || [productData.image_url || "placeholder.png"],
          colors: productData.colors || [],
          sizes: productData.sizes || [],
          specifications: productData.specifications || {},
          isNew: productData.isNew || false
        };
        
        setProduct(processedProduct);
        setError("");
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.discount > 0 
          ? product.price * (1 - product.discount / 100)
          : product.price,
        image_url: product.images[0],
        quantity
      });
      toast.success("Product added to cart!");
    }
  };

  const handleQuantityChange = (value) => {
    const newValue = quantity + value;
    if (newValue > 0 && newValue <= (product?.stock || 1)) {
      setQuantity(newValue);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <button 
          className="btn-primary"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="product-details-page"
    >
      <button 
        className="btn-back"
        onClick={() => navigate("/products")}
      >
        <FiArrowLeft /> Back to Products
      </button>

      <div className="product-details-container">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="thumbnail-container">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="main-image">
            {product.isNew && <span className="badge-new">New</span>}
            {product.discount > 0 && (
              <span className="badge-discount">-{product.discount}%</span>
            )}
            <img 
              src={product.images[selectedImage]} 
              alt={product.name} 
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          
          <div className="rating-container">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={i < Math.floor(product.rating) ? 'filled' : ''} 
                />
              ))}
            </div>
            <span className="review-count">({product.reviewCount} reviews)</span>
          </div>

          <div className="price-container">
            {product.discount > 0 && (
              <span className="original-price">
                ${product.price.toFixed(2)}
              </span>
            )}
            <span className="current-price">
              ${(product.price * (1 - product.discount / 100)).toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="discount-percentage">
                Save {product.discount}%
              </span>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="color-selection">
              <h3>Color:</h3>
              <div className="color-options">
                {product.colors.map((color, index) => (
                  <div 
                    key={index}
                    className="color-option"
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="size-selection">
              <h3>Size:</h3>
              <div className="size-options">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`size-option ${size.stock === 0 ? 'out-of-stock' : ''}`}
                    disabled={size.stock === 0}
                  >
                    {size.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <h3>Quantity:</h3>
            <div className="quantity-control">
              <button 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <span className="stock-status">
              {product.stock > 0 
                ? `${product.stock} available` 
                : "Out of stock"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-add-to-cart"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button 
              className="btn-wishlist"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <FiHeart className={isWishlisted ? 'wishlisted' : ''} />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Share Button */}
          <button className="btn-share">
            <FiShare2 /> Share this product
          </button>
        </div>
      </div>

      {/* Product Specifications */}
      {Object.keys(product.specifications).length > 0 && (
        <div className="specifications-section">
          <h2>Product Specifications</h2>
          <table className="specifications-table">
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
  
};


export default ProductDetailsPage;