import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";
import "../styles/CategoriesManagement.css";
import { useNavigate } from "react-router-dom";

// Helper to resolve full image URL
const getImageUrl = (path) => `${import.meta.env.VITE_API_URL}${path}`;

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({ name: "", image_url: "" });

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
    if (!trimmed) return setError("Category name is required.");

    const formData = new FormData();
    formData.append("name", trimmed);
    if (newCategoryImage) {
      formData.append("image", newCategoryImage); // must match multer field name
    }

    try {
      const response = await addCategory(formData); // should accept FormData
      setCategories([...categories, response.data]);
      setNewCategory("");
      setNewCategoryImage(null);
      setError("");
    } catch (err) {
      setError("Failed to add category.");
    }
  };

  const handleEditCategory = async (id) => {
    if (!updatedFields.name.trim()) return setError("Category name cannot be empty.");

    try {
      await updateCategory(id, {
        name: updatedFields.name.trim(),
        image_url: updatedFields.image_url.trim(),
      });
      setCategories(
        categories.map((cat) =>
          cat.id === id ? { ...cat, ...updatedFields } : cat
        )
      );
      setEditingCategory(null);
      setUpdatedFields({ name: "", image_url: "" });
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
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category.");
    }
  };

  return (
    <div className="categories-management-container">
      <div className="header">
        <h1>Manage Categories</h1>
        <button className="btn-back-to-dashboard" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="add-category">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => {
            setNewCategory(e.target.value);
            setError("");
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewCategoryImage(e.target.files[0])}
        />
        <button className="btn-add-category" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>

      <table className="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
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
                  <img
                    src={
                      category.image_url
                        ? getImageUrl(category.image_url)
                        : "/default-category.jpg"
                    }
                    alt={category.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                </td>
                <td>
                  {editingCategory === category.id ? (
                    <>
                      <input
                        type="text"
                        value={updatedFields.name}
                        onChange={(e) =>
                          setUpdatedFields({ ...updatedFields, name: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={updatedFields.image_url}
                        onChange={(e) =>
                          setUpdatedFields({ ...updatedFields, image_url: e.target.value })
                        }
                      />
                    </>
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
                          setUpdatedFields({ name: "", image_url: "" });
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
                          setUpdatedFields({
                            name: category.name,
                            image_url: category.image_url || "",
                          });
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
