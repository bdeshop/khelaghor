import { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import "./AddBannerModal.css";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  textEnglish?: string;
  textBangla?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface EditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  banner: Banner;
}

function EditBannerModal({
  isOpen,
  onClose,
  onSuccess,
  banner,
}: EditBannerModalProps) {
  const [title, setTitle] = useState("");
  const [textEnglish, setTextEnglish] = useState("");
  const [textBangla, setTextBangla] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with banner data
  useEffect(() => {
    if (banner) {
      setTitle(banner.title);
      setTextEnglish(banner.textEnglish || "");
      setTextBangla(banner.textBangla || "");
      setOrder(banner.order);
      setIsActive(banner.isActive);
      setImagePreview(`http://localhost:8000${banner.imageUrl}`);
      setImageFile(null);
    }
  }, [banner]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      setError("");

      // Create preview
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

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("title", title);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("textEnglish", textEnglish);
      formData.append("textBangla", textBangla);
      formData.append("order", order.toString());
      formData.append("isActive", isActive.toString());

      const response = await fetch(
        `http://localhost:8000/api/banners/${banner.id}`,
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
          message: "Failed to update banner",
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Banner updated successfully:", data);

      // Call success callback
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update banner";
      setError(errorMessage);
      console.error("Error updating banner:", err);
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
          <h2 className="modal-title">Edit Banner</h2>
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
          {/* Title */}
          <div className="form-group">
            <label className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter banner title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">
              Banner Image {imageFile && <span className="required">*</span>}
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
                    <p>Click to upload new banner image</p>
                    <span>PNG, JPG, GIF up to 5MB</span>
                  </div>
                </label>
              )}
            </div>
            {!imageFile && imagePreview && (
              <span className="form-hint">
                Keep current image or upload a new one
              </span>
            )}
          </div>

          {/* Text English */}
          <div className="form-group">
            <label className="form-label">Text (English)</label>
            <textarea
              className="form-input"
              placeholder="Enter banner text in English"
              value={textEnglish}
              onChange={(e) => setTextEnglish(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {/* Text Bangla */}
          <div className="form-group">
            <label className="form-label">Text (Bangla)</label>
            <textarea
              className="form-input"
              placeholder="ব্যানার টেক্সট বাংলায় লিখুন"
              value={textBangla}
              onChange={(e) => setTextBangla(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {/* Order */}
          <div className="form-group">
            <label className="form-label">Order</label>
            <input
              type="number"
              className="form-input"
              placeholder="Display order (0 = first)"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              disabled={isSubmitting}
              min="0"
            />
            <span className="form-hint">
              Lower numbers appear first (0 = highest priority)
            </span>
          </div>

          {/* Is Active */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={isSubmitting}
                className="checkbox-input"
              />
              <span>Active (show banner on website)</span>
            </label>
          </div>

          {/* Actions */}
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
                  <ImageIcon size={18} />
                  <span>Update Banner</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBannerModal;
