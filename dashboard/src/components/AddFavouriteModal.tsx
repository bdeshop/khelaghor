import { useState } from "react";
import { X, Upload, Heart } from "lucide-react";
import "./AddBannerModal.css";

interface AddFavouriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function AddFavouriteModal({
  isOpen,
  onClose,
  onSuccess,
}: AddFavouriteModalProps) {
  const [title, setTitle] = useState("");
  const [actionType, setActionType] = useState<"url" | "modal">("url");
  const [url, setUrl] = useState("");
  const [modalOptions, setModalOptions] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      setError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!imageFile) {
      setError("Image is required");
      return;
    }

    if (actionType === "url" && !url.trim()) {
      setError("URL is required when action type is URL");
      return;
    }

    if (actionType === "modal" && !modalOptions.trim()) {
      setError("Modal options are required when action type is Modal");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", imageFile);
      formData.append("actionType", actionType);
      formData.append("order", order.toString());
      formData.append("isActive", isActive.toString());

      if (actionType === "url") {
        formData.append("url", url);
      } else {
        formData.append("modalOptions", modalOptions);
      }

      const response = await fetch("http://localhost:8000/api/favourites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Failed to create favourite",
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Favourite created successfully:", data);

      setTitle("");
      setActionType("url");
      setUrl("");
      setModalOptions("");
      setOrder(1);
      setIsActive(true);
      setImageFile(null);
      setImagePreview("");

      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create favourite";
      setError(errorMessage);
      console.error("Error creating favourite:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setActionType("url");
      setUrl("");
      setModalOptions("");
      setOrder(1);
      setIsActive(true);
      setImageFile(null);
      setImagePreview("");
      setError("");
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Favourite</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="modal-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter favourite title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Image <span className="required">*</span>
            </label>
            <div className="image-upload-container">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    disabled={isSubmitting}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="image-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                    className="image-input"
                  />
                  <div className="upload-placeholder">
                    <Upload size={48} />
                    <p>Click to upload image</p>
                    <span>PNG, JPG, GIF up to 5MB</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Action Type <span className="required">*</span>
            </label>
            <select
              className="form-input"
              value={actionType}
              onChange={(e) => setActionType(e.target.value as "url" | "modal")}
              disabled={isSubmitting}
            >
              <option value="url">URL</option>
              <option value="modal">Modal</option>
            </select>
          </div>

          {actionType === "url" && (
            <div className="form-group">
              <label className="form-label">
                URL <span className="required">*</span>
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <span className="form-hint">
                Enter the full URL including https://
              </span>
            </div>
          )}

          {actionType === "modal" && (
            <div className="form-group">
              <label className="form-label">
                Modal Options <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Option 1, Option 2, Option 3"
                value={modalOptions}
                onChange={(e) => setModalOptions(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <span className="form-hint">Separate options with commas</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Order</label>
            <input
              type="number"
              className="form-input"
              placeholder="Display order"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
              disabled={isSubmitting}
              min="1"
            />
            <span className="form-hint">Lower numbers appear first</span>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={isSubmitting}
                className="checkbox-input"
              />
              <span>Active (show on website)</span>
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Heart size={18} />
                  <span>Create Favourite</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFavouriteModal;
