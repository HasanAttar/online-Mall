const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const { isAdmin } = require('../middlewares/auth'); // Import middleware to check for admin access

// Admin login
router.post('/login', adminController.login);

// Admin dashboard (protected route)
router.get('/dashboard', isAdmin, adminController.getDashboard);

module.exports = router;
