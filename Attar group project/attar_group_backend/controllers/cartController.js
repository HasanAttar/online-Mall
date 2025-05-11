const pool = require('../config/database');

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        if (!user_id || !product_id || !quantity) {
            return res.status(400).json({ message: 'User ID, Product ID, and Quantity are required' });
        }

        // Check if the product exists and has enough stock
        const productQuery = 'SELECT stock FROM products WHERE id = ?';
        const [product] = await pool.execute(productQuery, [product_id]);

        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product[0].stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock for this product' });
        }

        // Check if the item already exists in the cart
        const cartQuery = 'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?';
        const [cartItem] = await pool.execute(cartQuery, [user_id, product_id]);

        if (cartItem.length > 0) {
            // Update quantity if the item already exists
            const updateQuery = 'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
            await pool.execute(updateQuery, [quantity, user_id, product_id]);
        } else {
            // Insert new cart item
            const insertQuery = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)';
            await pool.execute(insertQuery, [user_id, product_id, quantity]);
        }

        res.status(201).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding item to cart', details: error.message });
    }
};

// Get cart items for a user
exports.getCartItems = async (req, res) => {
    try {
        const { user_id } = req.params;

        const query = `
            SELECT ci.id AS cart_item_id, ci.quantity, p.id AS product_id, p.name, p.price, p.stock 
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
        `;
        const [cartItems] = await pool.execute(query, [user_id]);

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cart items', details: error.message });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be a positive integer' });
        }

        const query = 'UPDATE cart_items SET quantity = ? WHERE id = ?';
        const [result] = await pool.execute(query, [quantity, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Cart item updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating cart item', details: error.message });
    }
};

// Remove an item from the cart
exports.removeCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM cart_items WHERE id = ?';
        const [result] = await pool.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Cart item removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing cart item', details: error.message });
    }
};

// Clear cart after order is placed
exports.clearCart = async (req, res) => {
    try {
        const { user_id } = req.params;

        const query = 'DELETE FROM cart_items WHERE user_id = ?';
        await pool.execute(query, [user_id]);

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error clearing cart', details: error.message });
    }
};
