const db = require('../config/database.js');

const User = {
    create: async (userData) => {
        const { name, email, password, role } = userData;
        const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(query, [name, email, password, role || 'customer']);
        return result;
    },

    findById: async (id) => {
        const query = 'SELECT id, name, email, role FROM users WHERE id = ?'; // Exclude password
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    },

    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = ?'; // Include password for login purposes
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    },

    getAll: async () => {
        const query = 'SELECT id, name, email, role FROM users'; // Exclude password
        const [rows] = await db.execute(query);
        return rows;
    },

    delete: async (id) => {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result;
    },

    update: async (id, userData) => {
        const fields = [];
        const values = [];

        // Dynamically build query based on provided fields
        if (userData.name) {
            fields.push('name = ?');
            values.push(userData.name);
        }
        if (userData.email) {
            fields.push('email = ?');
            values.push(userData.email);
        }
        if (userData.password) {
            fields.push('password = ?');
            values.push(userData.password);
        }
        if (userData.role) {
            fields.push('role = ?');
            values.push(userData.role);
        }

        values.push(id); // Add ID as the last parameter

        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(query, values);
        return result;
    },
};

module.exports = User;
