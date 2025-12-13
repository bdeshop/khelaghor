import { useState } from "react";
import { X, Upload, Wallet, Plus, Trash2 } from "lucide-react";
import "./AddBannerModal.css";
import "./DepositMethodModal.css";

interface UserInputField {
  fieldLabelEn: string;
  fieldLabelBn: string;
  fieldType: string;
  required: boolean;
}

interface AddWithdrawalMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function AddWithdrawalMethodModal({
  isOpen,
  onClose,
  onSuccess,
}: AddWithdrawalMethodModalProps) {
  const [methodNameEn, setMethodNameEn] = useState("");
  const [methodNameBn, setMethodNameBn] = useState("");
  const [minimumWithdrawal, setMinimumWithdrawal] = useState("");
  const [maximumWithdrawal, setMaximumWithdrawal] = useState("");
  const [processingTime, setProcessingTime] = useState("");
  const [status, setStatus] = useState("Active");
  const [withdrawalFee, setWithdrawalFee] = useState("");
  const [feeType, setFeeType] = useState("Fixed");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [buttonColor, setButtonColor] = useState("#007bff");
  const [instructionEn, setInstructionEn] = useState("");
  const [instructionBn, setInstructionBn] = useState("");
  const [userInputFields, setUserInputFields] = useState<UserInputField[]>([]);
  const [methodImageFile, setMethodImageFile] = useState<File | null>(null);
  const [methodImagePreview, setMethodImagePreview] = useState("");
  const [withdrawPageImageFile, setWithdrawPageImageFile] =
    useState<File | null>(null);
  const [withdrawPageImagePreview, setWithdrawPageImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleMethodImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setMethodImageFile(file);
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => setMethodImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleWithdrawPageImageChange = (
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
      setWithdrawPageImageFile(file);
      setError("");
      const reader = new FileReader();
      reader.onloadend = () =>
        setWithdrawPageImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addUserInputField = () => {
    setUserInputFields([
      ...userInputFields,
      {
        fieldLabelEn: "",
        fieldLabelBn: "",
        fieldType: "text",
        required: true,
      },
    ]);
  };

  const updateUserInputField = (
    index: number,
    field: Partial<UserInputField>
  ) => {
    const updated = [...userInputFields];
    updated[index] = { ...updated[index], ...field };
    setUserInputFields(updated);
  };

  const removeUserInputField = (index: number) => {
    setUserInputFields(userInputFields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!methodNameEn.trim()) {
      setError("Method name (English) is required");
      return;
    }
    if (!minimumWithdrawal || !maximumWithdrawal) {
      setError("Minimum and maximum withdrawal amounts are required");
      return;
    }
    if (!processingTime.trim()) {
      setError("Processing time is required");
      return;
    }
    if (!withdrawalFee) {
      setError("Withdrawal fee is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("methodNameEn", methodNameEn);
      formData.append("methodNameBn", methodNameBn);
      formData.append("minimumWithdrawal", minimumWithdrawal);
      formData.append("maximumWithdrawal", maximumWithdrawal);
      formData.append("processingTime", processingTime);
      formData.append("status", status);
      formData.append("withdrawalFee", withdrawalFee);
      formData.append("feeType", feeType);
      formData.append(
        "colors",
        JSON.stringify({
          textColor,
          backgroundColor,
          buttonColor,
        })
      );
      formData.append("instructionEn", instructionEn);
      formData.append("instructionBn", instructionBn);
      formData.append("userInputFields", JSON.stringify(userInputFields));

      if (methodImageFile) {
        formData.append("methodImage", methodImageFile);
      }
      if (withdrawPageImageFile) {
        formData.append("withdrawPageImage", withdrawPageImageFile);
      }

      const response = await fetch(
        "http://localhost:8000/api/withdraw-methods",
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
          message: "Failed to create withdrawal method",
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      console.log("Withdrawal method created successfully");
      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create withdrawal method";
      setError(errorMessage);
      console.error("Error creating withdrawal method:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setMethodNameEn("");
    setMethodNameBn("");
    setMinimumWithdrawal("");
    setMaximumWithdrawal("");
    setProcessingTime("");
    setStatus("Active");
    setWithdrawalFee("");
    setFeeType("Fixed");
    setTextColor("#000000");
    setBackgroundColor("#ffffff");
    setButtonColor("#007bff");
    setInstructionEn("");
    setInstructionBn("");
    setUserInputFields([]);
    setMethodImageFile(null);
    setMethodImagePreview("");
    setWithdrawPageImageFile(null);
    setWithdrawPageImagePreview("");
    setError("");
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Add Withdrawal Method</h2>
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
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Method Name (English) <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., bKash"
                value={methodNameEn}
                onChange={(e) => setMethodNameEn(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Method Name (Bangla)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., বিকাশ"
                value={methodNameBn}
                onChange={(e) => setMethodNameBn(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Minimum Withdrawal <span className="required">*</span>
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g., 100"
                value={minimumWithdrawal}
                onChange={(e) => setMinimumWithdrawal(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Maximum Withdrawal <span className="required">*</span>
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g., 50000"
                value={maximumWithdrawal}
                onChange={(e) => setMaximumWithdrawal(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Processing Time <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 24 hours"
                value={processingTime}
                onChange={(e) => setProcessingTime(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Withdrawal Fee <span className="required">*</span>
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g., 10"
                value={withdrawalFee}
                onChange={(e) => setWithdrawalFee(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Fee Type <span className="required">*</span>
              </label>
              <select
                className="form-input"
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="Fixed">Fixed</option>
                <option value="Percentage">Percentage</option>
              </select>
            </div>
          </div>

          <div className="form-row form-row-3">
            <div className="form-group">
              <label className="form-label">Text Color</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  className="form-input"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Background Color</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  className="form-input"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Button Color</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={buttonColor}
                  onChange={(e) => setButtonColor(e.target.value)}
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  className="form-input"
                  value={buttonColor}
                  onChange={(e) => setButtonColor(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Instruction (English)</label>
              <textarea
                className="form-input"
                placeholder="Enter instructions in English"
                value={instructionEn}
                onChange={(e) => setInstructionEn(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Instruction (Bangla)</label>
              <textarea
                className="form-input"
                placeholder="বাংলায় নির্দেশনা লিখুন"
                value={instructionBn}
                onChange={(e) => setInstructionBn(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Method Image</label>
              <div className="image-upload-container">
                {methodImagePreview ? (
                  <div className="image-preview">
                    <img src={methodImagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        setMethodImageFile(null);
                        setMethodImagePreview("");
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
                      onChange={handleMethodImageChange}
                      disabled={isSubmitting}
                      className="image-input"
                    />
                    <div className="upload-placeholder">
                      <Upload size={32} />
                      <p>Method Image</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Withdraw Page Image</label>
              <div className="image-upload-container">
                {withdrawPageImagePreview ? (
                  <div className="image-preview">
                    <img src={withdrawPageImagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        setWithdrawPageImageFile(null);
                        setWithdrawPageImagePreview("");
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
                      onChange={handleWithdrawPageImageChange}
                      disabled={isSubmitting}
                      className="image-input"
                    />
                    <div className="upload-placeholder">
                      <Upload size={32} />
                      <p>Withdraw Page Image</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="section-header">
              <label className="form-label">User Input Fields</label>
              <button
                type="button"
                className="btn-add-field"
                onClick={addUserInputField}
                disabled={isSubmitting}
              >
                <Plus size={16} /> Add Field
              </button>
            </div>
            {userInputFields.map((field, index) => (
              <div key={index} className="user-input-field-card">
                <div className="field-header">
                  <span>Field {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeUserInputField(index)}
                    disabled={isSubmitting}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Field Label (English)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Account Number"
                      value={field.fieldLabelEn}
                      onChange={(e) =>
                        updateUserInputField(index, {
                          fieldLabelEn: e.target.value,
                        })
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Field Label (Bangla)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., অ্যাকাউন্ট নম্বর"
                      value={field.fieldLabelBn}
                      onChange={(e) =>
                        updateUserInputField(index, {
                          fieldLabelBn: e.target.value,
                        })
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Field Type</label>
                    <select
                      className="form-input"
                      value={field.fieldType}
                      onChange={(e) =>
                        updateUserInputField(index, {
                          fieldType: e.target.value,
                        })
                      }
                      disabled={isSubmitting}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateUserInputField(index, {
                            required: e.target.checked,
                          })
                        }
                        disabled={isSubmitting}
                      />
                      <span>Required</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
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
                  <Wallet size={18} />
                  <span>Create Method</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWithdrawalMethodModal;
