const bcrypt = require('bcrypt');
const User = require('../models/User');

const userController = {
    createUser: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            // Validation
            if (!name || !email || !password) {
                return res.status(400).send({ error: 'Name, email, and password are required' });
            }
            if (!['admin', 'customer'].includes(role)) {
                return res.status(400).send({ error: 'Invalid role. Must be "admin" or "customer"' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            await User.create({ name, email, password: hashedPassword, role });
            res.status(201).send({ message: 'User created successfully!' });
        } catch (error) {
            res.status(500).send({ error: 'Error creating user', details: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
    
            // Allow if the logged-in user is fetching their own details or is an admin
            if (req.user.id !== user.id && req.user.role !== 'admin') {
                return res.status(403).send({ error: 'Access denied' });
            }
    
            res.status(200).send(user);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching user', details: error.message });
        }
    }
,    

    getAllUsers: async (req, res) => {
        try {
            const users = await User.getAll();
            res.status(200).send(users);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching users', details: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            await User.delete(req.params.id);
            res.status(200).send({ message: 'User deleted successfully!' });
        } catch (error) {
            res.status(500).send({ error: 'Error deleting user', details: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            // Validate role
            if (role && !['admin', 'customer'].includes(role)) {
                return res.status(400).send({ error: 'Invalid role. Must be "admin" or "customer"' });
            }

            // Hash password if it's being updated
            const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }

            // Update user
            await User.update(req.params.id, {
                name,
                email,
                password: hashedPassword,
                role,
            });

            res.status(200).send({ message: 'User updated successfully!' });
        } catch (error) {
            res.status(500).send({ error: 'Error updating user', details: error.message });
        }
    },
};
//AnaAn231
// const bcrypt = require('bcrypt');

// const bcrypt = require('bcrypt');

// const bcrypt = require('bcrypt');

(async () => {
    const plainPassword = 'AnaAn231'; // Replace with the plain password you created for admin
    const storedHash = '$2b$10$sUDXFqSgYux0Id3w4w18huMMuVP0W2atU4uwtrbijdNH7VPguh5kG'; // Replace with the hashed password from the database

    const isMatch = await bcrypt.compare(plainPassword, storedHash);
    console.log(isMatch ? 'Password matches!' : 'Invalid credentials.');
})();



module.exports = userController;
