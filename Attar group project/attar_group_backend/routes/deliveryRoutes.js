const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { isAdmin, isAuthenticated } = require('../middlewares/auth');

// Delivery routes
router.post('/', isAdmin, deliveryController.addDelivery); // Admin-only: Add delivery information
router.get('/:id', isAuthenticated, deliveryController.getDeliveryById); // Authenticated users can view delivery info
router.get('/', isAuthenticated, deliveryController.getAllDeliveries); // Authenticated users can view delivery info

router.put('/:id', isAdmin, deliveryController.updateDelivery); // Admin-only: Update delivery information
router.delete('/:id', isAdmin, deliveryController.deleteDelivery); // Admin-only: Delete delivery record

module.exports = router;
