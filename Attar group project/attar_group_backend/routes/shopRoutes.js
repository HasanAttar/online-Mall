const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { isAdmin, isAuthenticated } = require('../middlewares/auth');

// Shop routes
router.post('/', isAdmin, shopController.createShop); // Admin-only: Create a new shop
router.get('/', shopController.getAllShops); // Public: Get all shops
router.put('/:id', isAdmin, shopController.updateShop); // Admin-only: Update shop details
router.delete('/:id', isAdmin, shopController.deleteShop); // Admin-only: delete shop details


module.exports = router;
