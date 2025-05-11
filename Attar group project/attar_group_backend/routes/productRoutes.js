const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const { isAdmin, isAuthenticated } = require('../middlewares/auth');

// Product routes
router.post('/', isAdmin, productController.addProduct); // Admin-only: Add a product
router.get('/', productController.getAllProducts); // Public: Get all products
router.put('/:id', isAdmin, productController.updateProduct); // Admin-only: Update a product
router.delete('/:id', isAdmin, productController.deleteProduct); // Admin-only: Delete a product
router.get('/:id', productController.getProductById); // Get product by ID


module.exports = router;
