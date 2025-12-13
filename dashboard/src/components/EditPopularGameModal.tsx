import { useState, useEffect } from "react";
import { X, Upload, Gamepad2 } from "lucide-react";
import "./AddBannerModal.css";

interface PopularGame {
  _id: string;
  image: string;
  title: string;
  redirectUrl: string;
  isActive: boolean;
  order: number;
}

interface EditPopularGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  game: PopularGame;
}

function EditPopularGameModal({
  isOpen,
  onClose,
  onSuccess,
  game,
}: EditPopularGameModalProps) {
  const [title, setTitle] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (game) {
      setTitle(game.title);
      setRedirectUrl(game.redirectUrl);
      setOrder(game.order);
      setIsActive(game.isActive);
      setImagePreview(`http://localhost:8000${game.image}`);
    }
  }, [game]);

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

    if (!redirectUrl.trim()) {
      setError("Redirect URL is required");
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
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("redirectUrl", redirectUrl);
      formData.append("order", order.toString());
      formData.append("isActive", isActive.toString());

      const response = await fetch(
        `http://localhost:8000/api/popular-games/${game._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Failed to update popular game",
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Popular game updated successfully:", data);

      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update popular game";
      setError(errorMessage);
      console.error("Error updating popular game:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError("");
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Popular Game</h2>
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
              placeholder="Enter game title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Game Image</label>
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
                    <p>Click to upload new image</p>
                    <span>PNG, JPG, GIF, WEBP up to 5MB</span>
                  </div>
                </label>
              )}
            </div>
            <span className="form-hint">Leave empty to keep current image</span>
          </div>

          <div className="form-group">
            <label className="form-label">
              Redirect URL <span className="required">*</span>
            </label>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/game"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <span className="form-hint">
              Enter the full URL where users will be redirected
            </span>
          </div>

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
              <span>Active (show game on website)</span>
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
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Gamepad2 size={18} />
                  <span>Update Game</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPopularGameModal;
