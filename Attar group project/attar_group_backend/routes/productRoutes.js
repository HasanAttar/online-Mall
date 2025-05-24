const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware')
const { isAdmin, isAuthenticated } = require('../middlewares/auth');

// Product routes
router.post('/', isAdmin, productController.addProduct); // Admin-only: Add a product
router.get('/', productController.getAllProducts); // Public: Get all products
router.put('/:id', isAdmin, productController.updateProduct); // Admin-only: Update a product
router.delete('/:id', isAdmin, productController.deleteProduct); // Admin-only: Delete a product
router.get('/:id', productController.getProductById); // Get product by ID

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});
module.exports = router;
