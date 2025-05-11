const pool = require('../config/database');

// Helper: Validate Foreign Keys
const validateForeignKey = async (table, id) => {
    const query = `SELECT id FROM ${table} WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows.length > 0;
};

// Create a new shop
exports.createShop = async (req, res) => {
    try {
        const { name, description, owner_id } = req.body;

        // Validate input
        if (!name || !description || !owner_id) {
            return res.status(400).json({ message: 'Name, description, and owner_id are required' });
        }

        // Validate owner_id
        const isValidOwner = await validateForeignKey('users', owner_id);
        if (!isValidOwner) {
            return res.status(400).json({ message: 'Invalid owner_id. User does not exist.' });
        }

        // Check for duplicate shop name
        const duplicateQuery = 'SELECT id FROM shops WHERE name = ?';
        const [duplicateRows] = await pool.execute(duplicateQuery, [name]);
        if (duplicateRows.length > 0) {
            return res.status(400).json({ message: 'Shop with this name already exists' });
        }

        // Insert shop
        const query = 'INSERT INTO shops (name, description, owner_id) VALUES (?, ?, ?)';
        const [result] = await pool.execute(query, [name, description, owner_id]);
        res.status(201).json({ message: 'Shop created successfully', shopId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error creating shop', details: error.message });
    }
};

// Get all shops
exports.getAllShops = async (req, res) => {
    try {
        // Optional: Add pagination
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const query = 'SELECT * FROM shops LIMIT ? OFFSET ?';
        const [rows] = await pool.execute(query, [parseInt(limit), parseInt(offset)]);

        // Fetch total count for pagination metadata
        const countQuery = 'SELECT COUNT(*) AS total FROM shops';
        const [countResult] = await pool.execute(countQuery);

        res.status(200).json({
            shops: rows,
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching shops', details: error.message });
    }
};

// Update shop details
exports.updateShop = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Validate input
        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        // Update shop
        const query = 'UPDATE shops SET name = ?, description = ? WHERE id = ?';
        const [result] = await pool.execute(query, [name, description, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.status(200).json({ message: 'Shop updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating shop', details: error.message });
    }
};

exports.deleteShop = async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM shops WHERE id = ?';
      const [result] = await pool.execute(query, [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Shop not found' });
      }
  
      res.status(200).json({ message: 'Shop deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  