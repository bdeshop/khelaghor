import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  RefreshCw,
  X,
  Save,
} from "lucide-react";
import {
  getGameCategories,
  createGameCategory,
  updateGameCategory,
  deleteGameCategory,
  API_BASE_URL,
} from "../config/api";
import "./GameCategory.css";

interface Category {
  _id: string;
  name: string;
  icon?: string;
  order?: number;
  createdAt: string;
}

function GameCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    iconFile: null as File | null,
    order: 0,
  });

  const fetchCategories = useCallback(async () => {
    setFetchingCategories(true);
    setMessage(null);
    try {
      const response = await getGameCategories();
      if (response.success && response.categories) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setMessage({
        type: "error",
        text: "Failed to load categories",
      });
    } finally {
      setFetchingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        iconFile: file,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      if (formData.iconFile) {
        data.append("icon", formData.iconFile);
      }
      data.append("order", formData.order.toString());

      if (editingId) {
        await updateGameCategory(editingId, data);
        setMessage({
          type: "success",
          text: "Category updated successfully!",
        });
      } else {
        await createGameCategory(data);
        setMessage({
          type: "success",
          text: "Category created successfully!",
        });
      }

      setFormData({ name: "", iconFile: null, order: 0 });
      setIsEditing(false);
      setEditingId(null);
      await fetchCategories();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to save category",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      iconFile: null,
      order: category.order || 0,
    });
    setEditingId(category._id);
    setIsEditing(true);
    setMessage(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setLoading(true);
    setMessage(null);

    try {
      await deleteGameCategory(id);
      setMessage({
        type: "success",
        text: "Category deleted successfully!",
      });
      await fetchCategories();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to delete category",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", iconFile: null, order: 0 });
    setIsEditing(false);
    setEditingId(null);
    setMessage(null);
  };

  return (
    <div className="game-category-container">
      <div className="category-header">
        <h2 className="category-title">
          <FolderTree size={24} />
          Game Categories
        </h2>
        <div className="category-actions">
          <button
            className="refresh-btn"
            onClick={fetchCategories}
            disabled={fetchingCategories}
            title="Refresh categories"
          >
            <RefreshCw
              size={20}
              className={fetchingCategories ? "spinning" : ""}
            />
          </button>
          {!isEditing && (
            <button
              className="add-btn"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              <Plus size={20} />
              Add Category
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`category-message ${message.type}`}>{message.text}</div>
      )}

      {isEditing && (
        <div className="category-form-card">
          <h3 className="form-card-title">
            {editingId ? "Edit Category" : "Add New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">
                  Category Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g., Action, Sports"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="icon">
                  Icon <span className="required">*</span>
                </label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="icon"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editingId}
                  />
                  <label htmlFor="icon" className="file-input-label">
                    {formData.iconFile
                      ? formData.iconFile.name
                      : "Choose icon image"}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="order">Display Order</label>
                <input
                  type="number"
                  id="order"
                  placeholder="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                <X size={18} />
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {editingId ? "Update" : "Create"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {fetchingCategories ? (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <FolderTree size={64} />
          <h3>No Categories Found</h3>
          <p>Create your first game category to get started</p>
          <button className="add-btn" onClick={() => setIsEditing(true)}>
            <Plus size={20} />
            Add Category
          </button>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category._id} className="category-card">
              <div className="category-card-header">
                {category.icon && (
                  <img
                    src={`${API_BASE_URL}${category.icon}`}
                    alt={category.name}
                    className="category-icon-img"
                  />
                )}
                <h3 className="category-name">{category.name}</h3>
              </div>
              <div className="category-card-footer">
                <span className="category-order">Order: {category.order}</span>
                <div className="category-card-actions">
                  <button
                    className="icon-btn edit"
                    onClick={() => handleEdit(category)}
                    disabled={loading}
                    title="Edit category"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(category._id)}
                    disabled={loading}
                    title="Delete category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GameCategory;
