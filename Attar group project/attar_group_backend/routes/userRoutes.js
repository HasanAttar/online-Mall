const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();
const { isAdmin } = require('../middlewares/auth');

// Create a user
router.post('/',isAdmin, userController.createUser);

// Get a user by ID
router.get('/:id', userController.getUserById);

// Get all users
router.get('/', userController.getAllUsers);

// Delete a user
router.delete('/:id',isAdmin, userController.deleteUser);

router.put('/:id',isAdmin, userController.updateUser);


module.exports = router;
