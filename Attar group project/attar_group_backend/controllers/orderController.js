const pool = require('../config/database');

// Helper: Validate Foreign Key
const validateForeignKey = async (table, id) => {
    const query = `SELECT id FROM ${table} WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows.length > 0;
};

// Helper: Validate Stock Availability
const validateStock = async (product_id, quantity) => {
    const query = `SELECT stock FROM products WHERE id = ?`;
    const [rows] = await pool.execute(query, [product_id]);
    if (rows.length === 0) return false; // Product does not exist
    return rows[0].stock >= quantity; // Check stock availability
};

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { user_id, payment_method, items, delivery_address } = req.body;

        // Validate request body
        if (!user_id || !payment_method || !items || !delivery_address) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "'items' must be a non-empty array" });
        }

        // Validate foreign key: user_id
        const isValidUser = await validateForeignKey('users', user_id);
        if (!isValidUser) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        let total_price = 0;

        // Validate each item and calculate total price
        for (const item of items) {
            const { product_id, quantity, price } = item;
            if (!product_id || !quantity || !price) {
                return res.status(400).json({ message: 'Each item must include product_id, quantity, and price' });
            }

            // Validate stock availability
            const isStockAvailable = await validateStock(product_id, quantity);
            if (!isStockAvailable) {
                return res.status(400).json({ message: `Insufficient stock for product ID: ${product_id}` });
            }

            total_price += price * quantity;
        }

        // Insert into orders table
        const orderQuery = `
            INSERT INTO orders (user_id, total_price, status, payment_method, created_at) 
            VALUES (?, ?, 'Pending', ?, NOW())
        `;
        const [orderResult] = await pool.execute(orderQuery, [user_id, total_price, payment_method]);
        const orderId = orderResult.insertId;

        // Insert into delivery table
        const deliveryQuery = `
            INSERT INTO delivery (order_id, address, status, tracking_number, created_at) 
            VALUES (?, ?, 'Processing', '', NOW())
        `;
        await pool.execute(deliveryQuery, [orderId, delivery_address]);

        // Insert into order_items table and update product stock
        const orderItemsQuery = `
            INSERT INTO order_items (order_id, product_id, quantity, price, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        `;
        for (const item of items) {
            const { product_id, quantity, price } = item;
            await pool.execute(orderItemsQuery, [orderId, product_id, quantity, price]);

            // Reduce stock
            const stockQuery = `UPDATE products SET stock = stock - ? WHERE id = ?`;
            await pool.execute(stockQuery, [quantity, product_id]);
        }

        res.status(201).json({ message: 'Order created successfully', order_id: orderId, total_price });
    } catch (error) {
        res.status(500).json({ error: 'Error creating order', details: error.message });
    }
};

// Get all orders (with pagination)
exports.getAllOrders = async (req, res) => {
    try {
      const query = `
        SELECT 
          o.id AS order_id, 
          o.user_id, 
          o.total_price, 
          o.status, 
          o.payment_method, 
          o.created_at, 
          o.updated_at, 
          p.id AS product_id, 
          p.name AS product_name, 
          oi.quantity 
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
      `;
      const [rows] = await pool.execute(query);
  
      // Group products by order_id
      const orders = rows.reduce((acc, row) => {
        const {
          order_id,
          user_id,
          total_price,
          status,
          payment_method,
          created_at,
          updated_at,
          product_id,
          product_name,
          quantity,
        } = row;
  
        // Check if the order already exists in the accumulator
        const existingOrder = acc.find((order) => order.id === order_id);
  
        if (existingOrder) {
          // Add the product to the existing order
          existingOrder.products.push({ product_id, product_name, quantity });
        } else {
          // Create a new order entry
          acc.push({
            id: order_id,
            user_id,
            total_price,
            status,
            payment_method,
            created_at,
            updated_at,
            products: [{ product_id, product_name, quantity }],
          });
        }
  
        return acc;
      }, []);
  
      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ error: "Error fetching orders", details: error.message });
    }
  };
  
exports.updateOrderStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!["pending", "completed", "canceled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
  
      const query = "UPDATE orders SET status = ? WHERE id = ?";
      const [result] = await pool.execute(query, [status, id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json({ message: "Order status updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error updating order status", details: err.message });
    }
  };

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // From `isAuthenticated` middleware

        const query = `
            SELECT o.id AS order_id, o.user_id, o.total_price, o.status, 
                   o.payment_method, o.created_at, o.updated_at,
                   oi.product_id, oi.quantity, oi.price, 
                   p.name AS product_name, d.address AS delivery_address, d.status AS delivery_status
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN delivery d ON o.id = d.order_id
            WHERE o.id = ?
        `;
        const [order] = await pool.execute(query, [id]);

        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure the user has access to this order
        if (req.user.role !== 'admin' && order[0].user_id !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order', details: error.message });
    }
};
