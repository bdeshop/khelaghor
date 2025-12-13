import { useState, useEffect } from "react";
import { X, Save, User, Phone, DollarSign, Gift } from "lucide-react";
import { updateUser } from "../config/api";
import "./EditUserModal.css";

interface User {
  id: string;
  userName: string;
  phone: number;
  callingCode: string;
  balance: number;
  friendReferrerCode: string;
  myReferralCode: string;
  referredBy: string;
  role: "user" | "admin";
  createdAt: string;
}

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function EditUserModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const [formData, setFormData] = useState({
    userName: user.userName,
    phone: user.phone,
    callingCode: user.callingCode,
    balance: user.balance,
    friendReferrerCode: user.friendReferrerCode,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens with new user
  useEffect(() => {
    if (isOpen) {
      setFormData({
        userName: user.userName,
        phone: user.phone,
        callingCode: user.callingCode,
        balance: user.balance,
        friendReferrerCode: user.friendReferrerCode,
      });
      setError("");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user.id]); // Only reset when modal opens or user changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateUser(user.id, formData);
      console.log("User updated successfully");
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user";
      setError(errorMessage);
      console.error("Update error:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" || name === "balance" ? Number(value) : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              <User size={24} />
            </div>
            <div>
              <h2 className="modal-title">Edit User</h2>
              <p className="modal-subtitle">Update user information</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="modal-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group-modal">
              <label className="form-label-modal">
                <User size={16} />
                Username
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="form-input-modal"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group-modal">
              <label className="form-label-modal">
                <Phone size={16} />
                Calling Code
              </label>
              <input
                type="text"
                name="callingCode"
                value={formData.callingCode}
                onChange={handleChange}
                className="form-input-modal"
                placeholder="880"
                required
              />
            </div>

            <div className="form-group-modal">
              <label className="form-label-modal">
                <Phone size={16} />
                Phone Number
              </label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input-modal"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group-modal">
              <label className="form-label-modal">
                <DollarSign size={16} />
                Balance
              </label>
              <input
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                className="form-input-modal"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group-modal">
              <label className="form-label-modal">
                <Gift size={16} />
                Friend Referrer Code
              </label>
              <input
                type="text"
                name="friendReferrerCode"
                value={formData.friendReferrerCode}
                onChange={handleChange}
                className="form-input-modal"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="user-info-display">
            <div className="info-item">
              <span className="info-label">User ID:</span>
              <code className="info-value">{user.id}</code>
            </div>
            <div className="info-item">
              <span className="info-label">My Referral Code:</span>
              <code className="info-value">{user.myReferralCode}</code>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value role-badge">{user.role}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
