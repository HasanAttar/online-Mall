const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAdmin, isAuthenticated } = require('../middlewares/auth');

// Create a new order (accessible to authenticated users)
router.post('/', isAuthenticated, orderController.createOrder);

// Get all orders (admin-only)
router.get('/', isAdmin, orderController.getAllOrders);
router.put('/:id',orderController.updateOrderStatus)

// Get a specific order by ID (accessible to the user who placed the order or an admin)
router.get('/:id', isAuthenticated, orderController.getOrderById);

module.exports = router;
