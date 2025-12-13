import { useState, useEffect } from "react";
import { X, Upload, Gift } from "lucide-react";
import { getGameCategories, getActiveDepositMethods } from "../config/api";
import "./AddBannerModal.css";
import "./DepositMethodModal.css";

interface AddPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface GameCategory {
  _id: string;
  name: string;
}

interface DepositMethod {
  _id: string;
  method_name_en: string;
}

function AddPromotionModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPromotionModalProps) {
  console.log("AddPromotionModal rendered, isOpen:", isOpen);

  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [gameType, setGameType] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  // Bonus settings
  const [bonusType, setBonusType] = useState<"fixed" | "percentage">("fixed");
  const [bonusAmount, setBonusAmount] = useState("");
  const [bonusPercentage, setBonusPercentage] = useState("");
  const [maxBonusAmount, setMaxBonusAmount] = useState("");
  const [minDepositAmount, setMinDepositAmount] = useState("");

  const [promotionImageFile, setPromotionImageFile] = useState<File | null>(
    null
  );
  const [promotionImagePreview, setPromotionImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [gameCategories, setGameCategories] = useState<GameCategory[]>([]);
  const [depositMethods, setDepositMethods] = useState<DepositMethod[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchGameCategories();
      fetchDepositMethods();
    }
  }, [isOpen]);

  const fetchGameCategories = async () => {
    try {
      console.log("Fetching game categories...");
      const response = await getGameCategories();
      console.log("Game categories response:", response);

      // Handle different response structures
      let categories = [];
      if (Array.isArray(response)) {
        categories = response;
      } else if (response.categories && Array.isArray(response.categories)) {
        categories = response.categories;
      } else if (
        response.gameCategories &&
        Array.isArray(response.gameCategories)
      ) {
        categories = response.gameCategories;
      } else if (response.data && Array.isArray(response.data)) {
        categories = response.data;
      }

      console.log("Game categories parsed:", categories);
      setGameCategories(categories);
    } catch (err) {
      console.error("Error fetching game categories:", err);
      setGameCategories([]);
    }
  };

  const fetchDepositMethods = async () => {
    try {
      console.log("Fetching deposit methods...");
      const response = await getActiveDepositMethods();
      console.log("Deposit methods response:", response);

      // Handle different response structures
      let methods = [];
      if (Array.isArray(response)) {
        methods = response;
      } else if (
        response.depositMethods &&
        Array.isArray(response.depositMethods)
      ) {
        methods = response.depositMethods;
      } else if (response.data && Array.isArray(response.data)) {
        methods = response.data;
      }

      console.log("Deposit methods parsed:", methods);
      setDepositMethods(methods);
    } catch (err) {
      console.error("Error fetching deposit methods:", err);
      setDepositMethods([]);
    }
  };

  if (!isOpen) {
    console.log("Modal not open, returning null");
    return null;
  }

  console.log("Modal is open, rendering content...");

  const handlePromotionImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      setPromotionImageFile(file);
      setError("");
      const reader = new FileReader();
      reader.onloadend = () =>
        setPromotionImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentMethodChange = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.includes(methodId)
        ? prev.filter((id) => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!gameType) {
      setError("Game type is required");
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
      if (titleBn) formData.append("titleBn", titleBn);
      formData.append("description", description);
      if (descriptionBn) formData.append("descriptionBn", descriptionBn);
      formData.append("gameType", gameType);
      if (paymentMethods.length > 0) {
        formData.append("paymentMethods", JSON.stringify(paymentMethods));
      }

      // Build bonus settings JSON
      if (minDepositAmount) {
        const bonusSettingsObj: Record<string, number | string> = {
          bonusType,
          minDepositAmount: parseFloat(minDepositAmount),
        };

        if (bonusType === "fixed") {
          if (bonusAmount) {
            bonusSettingsObj.bonusAmount = parseFloat(bonusAmount);
          }
        } else {
          if (bonusPercentage) {
            bonusSettingsObj.bonusPercentage = parseFloat(bonusPercentage);
          }
          if (maxBonusAmount) {
            bonusSettingsObj.maxBonusAmount = parseFloat(maxBonusAmount);
          }
        }

        formData.append("bonusSettings", JSON.stringify(bonusSettingsObj));
      }

      if (promotionImageFile) {
        formData.append("promotionImage", promotionImageFile);
      }

      const response = await fetch(
        "http://localhost:8000/api/promotions/admin",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Failed to create promotion",
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      console.log("Promotion created successfully");
      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create promotion";
      setError(errorMessage);
      console.error("Error creating promotion:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setTitleBn("");
    setDescription("");
    setDescriptionBn("");
    setGameType("");
    setPaymentMethods([]);
    setBonusType("fixed");
    setBonusAmount("");
    setBonusPercentage("");
    setMaxBonusAmount("");
    setMinDepositAmount("");
    setPromotionImageFile(null);
    setPromotionImagePreview("");
    setError("");
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  console.log(
    "Rendering modal JSX, gameCategories:",
    gameCategories.length,
    "depositMethods:",
    depositMethods.length
  );

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Add Promotion</h2>
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
            <label className="form-label">Promotion Image</label>
            <div className="image-upload-container">
              {promotionImagePreview ? (
                <div className="image-preview">
                  <img src={promotionImagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      setPromotionImageFile(null);
                      setPromotionImagePreview("");
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
                    onChange={handlePromotionImageChange}
                    disabled={isSubmitting}
                    className="image-input"
                  />
                  <div className="upload-placeholder">
                    <Upload size={32} />
                    <p>Upload Promotion Image</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter promotion title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Title (Bangla)</label>
              <input
                type="text"
                className="form-input"
                placeholder="প্রচারের শিরোনাম"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                className="form-input"
                placeholder="Enter promotion description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={3}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description (Bangla)</label>
              <textarea
                className="form-input"
                placeholder="প্রচারের বিবরণ"
                value={descriptionBn}
                onChange={(e) => setDescriptionBn(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Game Type <span className="required">*</span>
            </label>
            <select
              className="form-input"
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
              disabled={isSubmitting}
              required
            >
              <option value="">Select game category</option>
              {Array.isArray(gameCategories) &&
                gameCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Methods</label>
            <div className="checkbox-group">
              {Array.isArray(depositMethods) &&
                depositMethods.map((method) => (
                  <label key={method._id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={paymentMethods.includes(method._id)}
                      onChange={() => handlePaymentMethodChange(method._id)}
                      disabled={isSubmitting}
                    />
                    <span>{method.method_name_en}</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bonus Settings</label>

            <div className="bonus-settings-container">
              <div className="form-group">
                <label className="form-label">Bonus Type</label>
                <select
                  className="form-input"
                  value={bonusType}
                  onChange={(e) =>
                    setBonusType(e.target.value as "fixed" | "percentage")
                  }
                  disabled={isSubmitting}
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div className="form-row">
                {bonusType === "fixed" ? (
                  <div className="form-group">
                    <label className="form-label">Bonus Amount</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g., 100"
                      value={bonusAmount}
                      onChange={(e) => setBonusAmount(e.target.value)}
                      disabled={isSubmitting}
                      min="0"
                      step="0.01"
                    />
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Bonus Percentage</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="e.g., 10"
                        value={bonusPercentage}
                        onChange={(e) => setBonusPercentage(e.target.value)}
                        disabled={isSubmitting}
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Max Bonus Amount</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="e.g., 500"
                        value={maxBonusAmount}
                        onChange={(e) => setMaxBonusAmount(e.target.value)}
                        disabled={isSubmitting}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label">Min Deposit Amount</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g., 50"
                    value={minDepositAmount}
                    onChange={(e) => setMinDepositAmount(e.target.value)}
                    disabled={isSubmitting}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
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
                  <Gift size={18} />
                  <span>Create Promotion</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPromotionModal;
