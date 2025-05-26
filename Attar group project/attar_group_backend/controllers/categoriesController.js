const pool = require('../config/database');

// Get all categories (with optional pagination)
exports.getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = 'SELECT * FROM categories LIMIT ? OFFSET ?';
    const [categories] = await pool.query(query, [parseInt(limit), parseInt(offset)]);

    const countQuery = 'SELECT COUNT(*) AS total FROM categories';
    const [countResult] = await pool.query(countQuery);

    res.status(200).json({
      categories,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO categories (name, image_url) VALUES (?, ?)',
      [name, image_url]
    );

    const [newCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);

    res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error("Error adding category:", error.message);
    res.status(500).json({ message: 'Error adding category' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, image_url = null } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Category name is required and cannot be empty' });
  }

  try {
    const categoryQuery = 'SELECT id FROM categories WHERE id = ?';
    const [categories] = await pool.query(categoryQuery, [id]);
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const duplicateQuery = 'SELECT id FROM categories WHERE name = ? AND id != ?';
    const [duplicates] = await pool.query(duplicateQuery, [name, id]);
    if (duplicates.length > 0) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    const updateQuery = 'UPDATE categories SET name = ?, image_url = ? WHERE id = ?';
    await pool.query(updateQuery, [name, image_url, id]);

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryQuery = 'SELECT id FROM categories WHERE id = ?';
    const [categories] = await pool.query(categoryQuery, [id]);
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const deleteQuery = 'DELETE FROM categories WHERE id = ?';
    await pool.query(deleteQuery, [id]);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
