import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  fetchCategories,
  fetchShops,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/api";
import axios from "../../services/axios"; // use custom axios instance
import { useNavigate } from "react-router-dom";
import "../styles/ProductManagement.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    shop_id: "",
    image_url: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productResponse, categoryResponse, shopResponse] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchShops(),
        ]);
        setProducts(productResponse.data.products);
        setCategories(categoryResponse.data.categories);
        setShops(shopResponse.data.shops);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data.");
      }
    };

    loadData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/api/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.imageUrl;
      setNewProduct({ ...newProduct, image_url: imageUrl });
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Failed to upload image.");
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await addProduct(newProduct);
      setProducts([...products, response.data.product]);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        shop_id: "",
        image_url: "",
      });
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product.");
    }
  };

  const handleEditProduct = async (id) => {
    try {
      const payload = {
        ...updatedProduct,
        price: parseFloat(updatedProduct.price),
        stock: parseInt(updatedProduct.stock),
      };

      await updateProduct(id, payload);
      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, ...updatedProduct } : product
        )
      );
      setEditingProduct(null);
      setUpdatedProduct({});
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product.");
    }
  };

  return (
    <div className="product-management-container">
      <div className="header">
        <h1>Manage Products</h1>
        <button className="btn-back" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}

      <div className="add-product">
        <h3>Add New Product</h3>
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          placeholder="Product name"
        />
        <textarea
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          placeholder="Product description"
        />
        <input
          type="number"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || "" })
          }
          placeholder="Price"
        />
        <input
          type="number"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || "" })
          }
          placeholder="Stock"
        />
        <select
          value={newProduct.category_id}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category_id: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={newProduct.shop_id}
          onChange={(e) => setNewProduct({ ...newProduct, shop_id: e.target.value })}
        >
          <option value="">Select Shop</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>

        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {newProduct.image_url && (
          <img
            src={newProduct.image_url}
            alt="Preview"
            style={{ width: "100px", marginTop: "10px" }}
          />
        )}

        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Shop</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(products) &&
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="product-image"
                  />
                </td>
                <td>
                  {editingProduct === product.id ? (
                    <input
                      type="text"
                      value={updatedProduct.name || product.name}
                      onChange={(e) =>
                        setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                      }
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {editingProduct === product.id ? (
                    <textarea
                      value={updatedProduct.description || product.description}
                      onChange={(e) =>
                        setUpdatedProduct({
                          ...updatedProduct,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  {categories.find((c) => c.id === product.category_id)?.name || "N/A"}
                </td>
                <td>{shops.find((s) => s.id === product.shop_id)?.name || "N/A"}</td>
                <td>
                  {editingProduct === product.id ? (
                    <button onClick={() => handleEditProduct(product.id)}>Save</button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingProduct(product.id);
                        setUpdatedProduct(product);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  <button onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
