import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";
import "../styles/CategoriesManagement.css";
import { useNavigate } from "react-router-dom";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      }
    };

    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) {
      return setError("Category name cannot be empty.");
    }

    if (categories.some((cat) => cat.name.toLowerCase() === trimmed.toLowerCase())) {
      return setError("Category already exists.");
    }

    try {
      const response = await addCategory({ name: trimmed });
      setCategories([...categories, response.data]);
      setNewCategory("");
      setError("");
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category.");
    }
  };

  const handleEditCategory = async (id) => {
    const trimmed = updatedName.trim();
    if (!trimmed) {
      return setError("Updated category name cannot be empty.");
    }

    if (
      categories.some(
        (cat) =>
          cat.id !== id && cat.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      return setError("Another category with the same name already exists.");
    }

    try {
      await updateCategory(id, { name: trimmed });
      setCategories(
        categories.map((category) =>
          category.id === id ? { ...category, name: trimmed } : category
        )
      );
      setEditingCategory(null);
      setUpdatedName("");
      setError("");
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this category?");
    if (!confirm) return;

    try {
      await deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
      setError("");
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category.");
    }
  };

  return (
    <div className="categories-management-container">
      <div className="header">
        <h1>Manage Categories</h1>
        <button
          className="btn-back-to-dashboard"
          onClick={() => navigate("/admin/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="add-category">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => {
            setNewCategory(e.target.value);
            setError("");
          }}
          placeholder="New category name"
        />
        <button className="btn-add-category" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      <table className="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(categories) &&
            categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  {editingCategory === category.id ? (
                    <input
                      type="text"
                      value={updatedName}
                      onChange={(e) => {
                        setUpdatedName(e.target.value);
                        setError("");
                      }}
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td>
                  {editingCategory === category.id ? (
                    <>
                      <button
                        className="btn-save"
                        onClick={() => handleEditCategory(category.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => {
                          setEditingCategory(null);
                          setUpdatedName("");
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingCategory(category.id);
                          setUpdatedName(category.name);
                          setError("");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesManagement;
