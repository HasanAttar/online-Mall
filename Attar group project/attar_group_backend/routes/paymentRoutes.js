const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/', paymentController.createPayment); // Create a payment
router.get('/:id', paymentController.getPaymentDetails); // Get a payment by ID
router.get('/', paymentController.getAllPayments); // Get all payments
router.put('/:id', paymentController.updatePayment); // Update payment status

module.exports = router;
