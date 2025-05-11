const jwt = require('jsonwebtoken');

// Middleware to verify if user is authenticated
const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token to request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error });
    }
};

// Middleware to verify if user is admin
const isAdmin = (req, res, next) => {
    isAuthenticated(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied: Admins only' });
        }
    });
};

module.exports = { isAuthenticated, isAdmin };
