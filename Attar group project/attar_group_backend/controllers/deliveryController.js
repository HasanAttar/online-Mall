const pool = require('../config/database');

// Helper: Validate Foreign Key
const validateForeignKey = async (table, id) => {
    const query = `SELECT id FROM ${table} WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows.length > 0;
};

// Add a new delivery
exports.addDelivery = async (req, res) => {
    try {
        const { order_id, address, phone, status, tracking_number } = req.body;

        // Validate input
        if (!order_id || !address || !phone || !status) {
            return res.status(400).json({ message: 'Order ID, address, phone, and status are required' });
        }

        // Validate foreign key: order_id
        const isValidOrder = await validateForeignKey('orders', order_id);
        if (!isValidOrder) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        // Insert into delivery table
        const query = `INSERT INTO delivery (order_id, address, phone, status, tracking_number, created_at, updated_at) 
                       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
        const [result] = await pool.execute(query, [order_id, address, phone, status, tracking_number]);

        res.status(201).json({ message: 'Delivery added successfully', delivery_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error adding delivery', details: error.message });
    }
};

// Get all deliveries (with pagination)
exports.getAllDeliveries = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const query = 'SELECT * FROM delivery LIMIT ? OFFSET ?';
        const [deliveries] = await pool.execute(query, [parseInt(limit), parseInt(offset)]);

        // Fetch total count for pagination metadata
        const countQuery = 'SELECT COUNT(*) AS total FROM delivery';
        const [countResult] = await pool.execute(countQuery);

        res.status(200).json({
            deliveries,
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching deliveries', details: error.message });
    }
};

// Get a single delivery by ID
exports.getDeliveryById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'SELECT * FROM delivery WHERE id = ?';
        const [deliveries] = await pool.execute(query, [id]);

        if (deliveries.length === 0) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        res.status(200).json(deliveries[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching delivery', details: error.message });
    }
};

// Update a delivery
exports.updateDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const { address, phone, status, tracking_number } = req.body;

        if (!address || !phone || !status) {
            return res.status(400).json({ message: 'Address, phone, and status are required for updating' });
        }

        const query = `UPDATE delivery 
                       SET address = ?, phone = ?, status = ?, tracking_number = ?, updated_at = NOW() 
                       WHERE id = ?`;
        const [result] = await pool.execute(query, [address, phone, status, tracking_number, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        res.status(200).json({ message: 'Delivery updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating delivery', details: error.message });
    }
};

// Delete a delivery
exports.deleteDelivery = async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM delivery WHERE id = ?';
        const [result] = await pool.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        res.status(200).json({ message: 'Delivery deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting delivery', details: error.message });
    }
};
