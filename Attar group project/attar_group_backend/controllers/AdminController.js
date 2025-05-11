const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Admin Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if the admin exists
        const query = 'SELECT id, email, password, role FROM users WHERE email = ? AND role = "admin"';
        const [users] = await pool.execute(query, [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const admin = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in', details: error.message });
    }
};

// Admin Dashboard
exports.getDashboard = async (req, res) => {
    try {
        // Fetch platform statistics
        const statsQuery = `
            SELECT 
                (SELECT COUNT(*) FROM users) AS totalUsers,
                (SELECT COUNT(*) FROM orders) AS totalOrders,
                (SELECT COUNT(*) FROM products) AS totalProducts,
                (SELECT SUM(total_price) FROM orders WHERE status = 'Completed') AS totalSales
        `;
        const [stats] = await pool.execute(statsQuery);

        res.status(200).json({
            dashboard: {
                totalUsers: stats[0].totalUsers,
                totalOrders: stats[0].totalOrders,
                totalProducts: stats[0].totalProducts,
                totalSales: stats[0].totalSales || 0, // Default to 0 if no sales
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dashboard', details: error.message });
    }
};
