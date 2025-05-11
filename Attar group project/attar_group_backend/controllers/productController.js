const pool = require('../config/database');

// Helper: Validate Foreign Keys
const validateForeignKey = async (table, id) => {
    const query = `SELECT id FROM ${table} WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows.length > 0;
};

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        const { shop_id, name, description, price, stock, image_url, category_id } = req.body;

        if (!shop_id || !name || !price || !stock || !category_id) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        const isValidShop = await validateForeignKey('shops', shop_id);
        if (!isValidShop) {
            return res.status(400).json({ message: 'Invalid shop ID' });
        }

        const isValidCategory = await validateForeignKey('categories', category_id);
        if (!isValidCategory) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        const query = `INSERT INTO products (shop_id, name, description, price, stock, image_url, category_id) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [shop_id, name, description, price, stock, image_url, category_id]);

        // Fetch the newly added product
        const productQuery = `SELECT p.*, s.name AS shop_name, c.name AS category_name
                              FROM products p
                              JOIN shops s ON p.shop_id = s.id
                              JOIN categories c ON p.category_id = c.id
                              WHERE p.id = ?`;
        const [newProduct] = await pool.execute(productQuery, [result.insertId]);

        res.status(201).json({ message: 'Product added successfully', product: newProduct[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error adding product', details: error.message });
    }
};


// Get all products (with pagination and related data)
exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const query = `
            SELECT p.*, s.name AS shop_name, c.name AS category_name 
            FROM products p
            JOIN shops s ON p.shop_id = s.id
            JOIN categories c ON p.category_id = c.id
            LIMIT ? OFFSET ?`;
        const [products] = await pool.execute(query, [parseInt(limit), parseInt(offset)]);

        const countQuery = 'SELECT COUNT(*) AS total FROM products';
        const [countResult] = await pool.execute(countQuery);

        res.status(200).json({
            products,
            total: countResult[0].total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
};
// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const query = `
        SELECT p.*, s.name AS shop_name, c.name AS category_name
        FROM products p
        JOIN shops s ON p.shop_id = s.id
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `;
      const [result] = await pool.execute(query, [id]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Error fetching product details", details: error.message });
    }
  };
  exports.getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const query = `
        SELECT p.*, s.name AS shop_name, c.name AS category_name
        FROM products p
        JOIN shops s ON p.shop_id = s.id
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `;
      const [result] = await pool.execute(query, [id]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Error fetching product details", details: error.message });
    }
  };
  exports.getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const query = `
        SELECT p.*, s.name AS shop_name, c.name AS category_name
        FROM products p
        JOIN shops s ON p.shop_id = s.id
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `;
      const [result] = await pool.execute(query, [id]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Error fetching product details", details: error.message });
    }
  };
      


// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, image_url, category_id } = req.body;

        // Validation: Check required fields
        if (!name || !price || !stock || !category_id) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Validation: Check foreign key
        const isValidCategory = await validateForeignKey('categories', category_id);
        if (!isValidCategory) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        // Validation: Check data types
        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({ message: 'Price must be a non-negative number' });
        }

        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({ message: 'Stock must be a non-negative integer' });
        }

        // Update product
        const query = `UPDATE products 
                       SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category_id = ? 
                       WHERE id = ?`;
        const [result] = await pool.execute(query, [name, description, price, stock, image_url, category_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating product', details: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM products WHERE id = ?';
        const [result] = await pool.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product', details: error.message });
    }
};
