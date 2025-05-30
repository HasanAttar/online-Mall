const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const upload = require('../middlewares/uploadMiddleware');
const { isAdmin } = require('../middlewares/auth');
// Route definitions
router.get('/', categoriesController.getCategories);
router.post('/',isAdmin, upload.single('image'), categoriesController.addCategory);
router.put('/:id',isAdmin, categoriesController.updateCategory);
router.delete('/:id',isAdmin, categoriesController.deleteCategory);

module.exports = router;
