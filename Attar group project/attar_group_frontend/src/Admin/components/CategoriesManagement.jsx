import React, { useEffect, useState } from "react";
import { fetchCategories, addCategory, updateCategory, deleteCategory } from "../../services/api";
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
        setCategories(response.data.categories); // Ensure data comes directly from the backend
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      }
    };

    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      const response = await addCategory({ name: newCategory }); // Send the new category to the backend
      const newCategoryFromBackend = response.data;
  
      if (!newCategoryFromBackend.id) {
        console.error("Backend did not return an ID for the new category");
        return;
      }
  
      setCategories([...categories, newCategoryFromBackend]); // Append the new category to the list
      setNewCategory(""); // Clear the input field
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category.");
    }
  };
  

  const handleEditCategory = async (id) => {
    try {
      await updateCategory(id, { name: updatedName });
      setCategories(
        categories.map((category) =>
          category.id === id ? { ...category, name: updatedName } : category
        )
      );
      setEditingCategory(null);
      setUpdatedName("");
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
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
          onChange={(e) => setNewCategory(e.target.value)}
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
                      onChange={(e) => setUpdatedName(e.target.value)}
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td>
                  {editingCategory === category.id ? (
                    <button
                      className="btn-save"
                      onClick={() => handleEditCategory(category.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditingCategory(category.id);
                        setUpdatedName(category.name);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesManagement;