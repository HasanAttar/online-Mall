import axios from "./axios";

// Shop Endpoints
export const fetchShops = async () => await axios.get("/api/shops");
export const addShop=async(shopData)=>await axios.post("/api/shops",shopData)
export const deleteShop = async (id) => await axios.delete(`/api/shops/${id}`);
export const updateShop = async (id, updatedData) => await axios.put(`/api/shops/${id}`, updatedData);


// Category Endpoints
export const fetchCategories = async () => await axios.get("/api/categories");
export const addCategory = async (categoryData) => await axios.post("/api/categories", categoryData);
export const updateCategory = async (id, updatedData) => await axios.put(`/api/categories/${id}`, updatedData);
export const deleteCategory = async (id) => await axios.delete(`/api/categories/${id}`);

// Product Endpoints
export const fetchProducts = async () => await axios.get("/api/products");
export const fetchProductById = async (id) => await axios.get(`/api/products/${id}`);
export const addProduct = async (productData) => await axios.post("/api/products", productData);
export const updateProduct = async (id, updatedData) => await axios.put(`/api/products/${id}`, updatedData);
export const deleteProduct = async (id) => await axios.delete(`/api/products/${id}`);

// Order Endpoints
export const createOrder = async (orderDetails) => await axios.post("/api/orders", orderDetails);
export const fetchOrders = async () => await axios.get("/api/orders");
export const updateOrderStatus = async (id, data) =>
await axios.put(`/api/orders/${id}`, data);

// Delivery Endpoints
export const fetchDeliveries = async () => await axios.get("/api/delivery");
export const updateDelivery = async (id, updatedData) => await axios.put(`/api/delivery/${id}`, updatedData);

// Payment Endpoints
export const fetchPayments = async () => await axios.get("/api/payments");
export const updatePayment = async (id, updatedData) =>
    await axios.put(`/api/payments/${id}`, updatedData);

// User Endpoints
export const fetchUsers = async () => await axios.get("/users");
export const addUser = async (userData) => await axios.post("/users", userData);
export const updateUser = async (id, updatedData) => await axios.put(`/users/${id}`, updatedData);
export const deleteUser = async (id) => await axios.delete(`/users/${id}`);

export const fetchCartItems = async () => await axios.get("/api/cart");
export const addCartItem = async (item) => await axios.post("/api/cart", item);
export const updateCartItem = async (id, quantity) =>
  await axios.put(`/api/cart/${id}`, { quantity });
export const removeCartItem = async (id) => await axios.delete(`/api/cart/${id}`);
export const clearCartItems = async () => await axios.delete("/api/cart");


// Admin Authentication
export const loginAdmin = async (credentials) => await axios.post("/admin/login", credentials);

