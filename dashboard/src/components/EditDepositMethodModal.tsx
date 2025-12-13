import { useState, useEffect } from "react";
import { X, Upload, CreditCard, Plus, Trash2 } from "lucide-react";
import "./AddBannerModal.css";
import "./DepositMethodModal.css";

interface UserInputField {
  name: string;
  type: string;
  isRequired: boolean;
  label_en: string;
  label_bd: string;
  instruction_en: string;
  instruction_bd: string;
}

interface DepositMethod {
  id: string;
  method_name_en: string;
  method_name_bd: string;
  agent_wallet_number: string;
  agent_wallet_text: string;
  gateways: string[];
  method_image?: string;
  payment_page_image?: string;
  text_color: string;
  background_color: string;
  button_color: string;
  status: string;
  instruction_en: string;
  instruction_bd: string;
  user_input_fields: UserInputField[];
  createdAt: string;
  updatedAt: string;
}

interface EditDepositMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  depositMethod: DepositMethod;
}

function EditDepositMethodModal({
  isOpen,
  onClose,
  onSuccess,
  depositMethod,
}: EditDepositMethodModalProps) {
  const [methodNameEn, setMethodNameEn] = useState("");
  const [methodNameBd, setMethodNameBd] = useState("");
  const [agentWalletNumber, setAgentWalletNumber] = useState("");
  const [agentWalletText, setAgentWalletText] = useState("");
  const [gateways, setGateways] = useState<string[]>([]);
  const [gatewayInput, setGatewayInput] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [buttonColor, setButtonColor] = useState("#007bff");
  const [status, setStatus] = useState("Active");
  const [instructionEn, setInstructionEn] = useState("");
  const [instructionBd, setInstructionBd] = useState("");
  const [userInputFields, setUserInputFields] = useState<UserInputField[]>([]);
  const [methodImageFile, setMethodImageFile] = useState<File | null>(null);
  const [methodImagePreview, setMethodImagePreview] = useState("");
  const [paymentPageImageFile, setPaymentPageImageFile] = useState<File | null>(
    null
  );
  const [paymentPageImagePreview, setPaymentPageImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (depositMethod) {
      setMethodNameEn(depositMethod.method_name_en || "");
      setMethodNameBd(depositMethod.method_name_bd || "");
      setAgentWalletNumber(depositMethod.agent_wallet_number || "");
      setAgentWalletText(depositMethod.agent_wallet_text || "");
      setGateways(depositMethod.gateways || []);
      setTextColor(depositMethod.text_color || "#000000");
      setBackgroundColor(depositMethod.background_color || "#ffffff");
      setButtonColor(depositMethod.button_color || "#007bff");
      setStatus(depositMethod.status || "Active");
      setInstructionEn(depositMethod.instruction_en || "");
      setInstructionBd(depositMethod.instruction_bd || "");
      setUserInputFields(depositMethod.user_input_fields || []);
      setMethodImagePreview(
        depositMethod.method_image
          ? `http://localhost:8000${depositMethod.method_image}`
          : ""
      );
      setPaymentPageImagePreview(
        depositMethod.payment_page_image
          ? `http://localhost:8000${depositMethod.payment_page_image}`
          : ""
      );
      setMethodImageFile(null);
      setPaymentPageImageFile(null);
    }
  }, [depositMethod]);

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

  const handlePaymentPageImageChange = (
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
      setPaymentPageImageFile(file);
      setError("");
      const reader = new FileReader();
      reader.onloadend = () =>
        setPaymentPageImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addGateway = () => {
    if (gatewayInput.trim() && !gateways.includes(gatewayInput.trim())) {
      setGateways([...gateways, gatewayInput.trim()]);
      setGatewayInput("");
    }
  };

  const removeGateway = (index: number) => {
    setGateways(gateways.filter((_, i) => i !== index));
  };

  const addUserInputField = () => {
    setUserInputFields([
      ...userInputFields,
      {
        name: "",
        type: "text",
        isRequired: true,
        label_en: "",
        label_bd: "",
        instruction_en: "",
        instruction_bd: "",
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
    if (!agentWalletNumber.trim()) {
      setError("Agent wallet number is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append("method_name_en", methodNameEn);
      formData.append("method_name_bd", methodNameBd);
      formData.append("agent_wallet_number", agentWalletNumber);
      formData.append("agent_wallet_text", agentWalletText);
      formData.append("gateways", JSON.stringify(gateways));
      formData.append("text_color", textColor);
      formData.append("background_color", backgroundColor);
      formData.append("button_color", buttonColor);
      formData.append("status", status);
      formData.append("instruction_en", instructionEn);
      formData.append("instruction_bd", instructionBd);
      formData.append("user_input_fields", JSON.stringify(userInputFields));

      if (methodImageFile) {
        formData.append("method_image", methodImageFile);
      }
      if (paymentPageImageFile) {
        formData.append("payment_page_image", paymentPageImageFile);
      }

      const response = await fetch(
        `http://localhost:8000/api/deposit-methods/${depositMethod.id}`,
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
          message: "Failed to update deposit method",
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      console.log("Deposit method updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update deposit method";
      setError(errorMessage);
      console.error("Error updating deposit method:", err);
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
      <div
        className="modal-content modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Edit Deposit Method</h2>
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
          {/* Method Names */}
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
                value={methodNameBd}
                onChange={(e) => setMethodNameBd(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Agent Wallet */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Agent Wallet Number <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 01712345678"
                value={agentWalletNumber}
                onChange={(e) => setAgentWalletNumber(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Agent Wallet Text</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Send money to this number"
                value={agentWalletText}
                onChange={(e) => setAgentWalletText(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Gateways */}
          <div className="form-group">
            <label className="form-label">Gateways</label>
            <div className="gateway-input-row">
              <input
                type="text"
                className="form-input"
                placeholder="Add gateway"
                value={gatewayInput}
                onChange={(e) => setGatewayInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addGateway())
                }
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="btn-add-gateway"
                onClick={addGateway}
                disabled={isSubmitting}
              >
                <Plus size={18} />
              </button>
            </div>
            {gateways.length > 0 && (
              <div className="gateway-tags">
                {gateways.map((gateway, index) => (
                  <span key={index} className="gateway-tag">
                    {gateway}
                    <button type="button" onClick={() => removeGateway(index)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Colors */}
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

          {/* Status */}
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

          {/* Instructions */}
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
                value={instructionBd}
                onChange={(e) => setInstructionBd(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
            </div>
          </div>

          {/* Images */}
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
              {!methodImageFile && methodImagePreview && (
                <span className="form-hint">
                  Keep current image or upload a new one
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Payment Page Image</label>
              <div className="image-upload-container">
                {paymentPageImagePreview ? (
                  <div className="image-preview">
                    <img src={paymentPageImagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        setPaymentPageImageFile(null);
                        setPaymentPageImagePreview("");
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
                      onChange={handlePaymentPageImageChange}
                      disabled={isSubmitting}
                      className="image-input"
                    />
                    <div className="upload-placeholder">
                      <Upload size={32} />
                      <p>Payment Page Image</p>
                    </div>
                  </label>
                )}
              </div>
              {!paymentPageImageFile && paymentPageImagePreview && (
                <span className="form-hint">
                  Keep current image or upload a new one
                </span>
              )}
            </div>
          </div>

          {/* User Input Fields */}
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
                    <label className="form-label">Field Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., transaction_id"
                      value={field.name}
                      onChange={(e) =>
                        updateUserInputField(index, { name: e.target.value })
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select
                      className="form-input"
                      value={field.type}
                      onChange={(e) =>
                        updateUserInputField(index, { type: e.target.value })
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
                        checked={field.isRequired}
                        onChange={(e) =>
                          updateUserInputField(index, {
                            isRequired: e.target.checked,
                          })
                        }
                        disabled={isSubmitting}
                      />
                      <span>Required</span>
                    </label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Label (English)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Transaction ID"
                      value={field.label_en}
                      onChange={(e) =>
                        updateUserInputField(index, {
                          label_en: e.target.value,
                        })
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Label (Bangla)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., লেনদেন আইডি"
                      value={field.label_bd}
                      onChange={(e) =>
                        updateUserInputField(index, {
                          label_bd: e.target.value,
                        })
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Instruction (English)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Field instruction"
                      value={field.instruction_en}
                      onChange={(e) =>
                        updateUserInputField(index, {
                          instruction_en: e.target.value,
                        })
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Instruction (Bangla)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ফিল্ড নির্দেশনা"
                      value={field.instruction_bd}
                      onChange={(e) =>
                        updateUserInputField(index, {
                          instruction_bd: e.target.value,
                        })
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            ))}
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
                  <CreditCard size={18} />
                  <span>Update Method</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDepositMethodModal;
