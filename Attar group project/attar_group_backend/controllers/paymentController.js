const pool = require('../config/database');

// Helper: Validate Foreign Key
const validateForeignKey = async (table, id) => {
    const query = `SELECT id FROM ${table} WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows.length > 0;
};

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const { order_id, amount, payment_method } = req.body;

        // Validate input
        if (!order_id || !amount || !payment_method) {
            return res.status(400).json({ message: 'Order ID, amount, and payment method are required' });
        }
        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        // Validate foreign key
        const isValidOrder = await validateForeignKey('orders', order_id);
        if (!isValidOrder) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        // Insert into payments table
        const query = `
            INSERT INTO payments (order_id, amount, payment_method, status, created_at) 
            VALUES (?, ?, ?, 'Pending', NOW())
        `;
        const [result] = await pool.execute(query, [order_id, amount, payment_method]);

        res.status(201).json({ message: 'Payment created successfully', payment_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error creating payment', details: error.message });
    }
};

// Update payment status
exports.updatePayment = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!id || !status) {
      return res.status(400).json({ message: "Payment ID and status are required" });
    }
  
    try {
      const query = "UPDATE payments SET status = ? WHERE id = ?";
      const [result] = await pool.execute(query, [status, id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Payment not found" });
      }
  
      res.status(200).json({ message: "Payment updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating payment", details: error.message });
    }
  };
  
// Get payment details
exports.getPaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // From `isAuthenticated` middleware

        const query = `
            SELECT p.*, o.user_id 
            FROM payments p
            JOIN orders o ON p.order_id = o.id
            WHERE p.id = ?
        `;
        const [payment] = await pool.execute(query, [id]);

        if (payment.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Ensure the user has access to this payment
        if (req.user.role !== 'admin' && payment[0].user_id !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(payment[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching payment', details: error.message });
    }
};


// Get all payments (with pagination)
exports.getAllPayments = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const query = `
            SELECT p.*, o.user_id, o.total_price 
            FROM payments p
            JOIN orders o ON p.order_id = o.id
            LIMIT ? OFFSET ?
        `;
        const [payments] = await pool.execute(query, [parseInt(limit), parseInt(offset)]);

        // Get total count for pagination
        const countQuery = 'SELECT COUNT(*) AS total FROM payments';
        const [countResult] = await pool.execute(countQuery);

        res.status(200).json({
            payments,
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching payments', details: error.message });
    }
};
