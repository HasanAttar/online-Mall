const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add item to cart
router.post('/', cartController.addToCart);

// Get cart items for a user
router.get('/:user_id', cartController.getCartItems);

// Update cart item quantity
router.put('/:id', cartController.updateCartItem);

// Remove a cart item
router.delete('/cart/:id', cartController.removeCartItem);

// Clear cart
router.delete('/user/:user_id', cartController.clearCart);

module.exports = router;
