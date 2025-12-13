import { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import axios from "axios";
import "./TransactionDetailsModal.css";

interface WithdrawTransaction {
  _id: string;
  userId: {
    _id: string;
    userName: string;
    phone: number;
    balance: number;
  };
  withdrawMethodId: {
    _id: string;
    methodNameEn: string;
    methodNameBn: string;
  };
  amount: number;
  withdrawalFee: number;
  netAmount: number;
  status: "pending" | "approved" | "cancelled";
  userInputData?: Record<string, unknown>;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

interface WithdrawDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: WithdrawTransaction | null;
  onSuccess: () => void;
}

const WithdrawDetailsModal = ({
  isOpen,
  onClose,
  transaction,
  onSuccess,
}: WithdrawDetailsModalProps) => {
  const [adminNote, setAdminNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const API_URL = "http://localhost:8000/api";

  if (!isOpen || !transaction) return null;

  const handleUpdateStatus = async (status: "approved" | "cancelled") => {
    try {
      setActionLoading(true);
      const authToken = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/withdraw-transactions/admin/${transaction._id}`,
        { status, adminNote },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      onSuccess();
      onClose();
      alert(`Withdrawal ${status} successfully!`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Error updating withdrawal");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { icon: Clock, color: "warning", label: "Pending" },
      approved: { icon: CheckCircle, color: "success", label: "Approved" },
      cancelled: { icon: XCircle, color: "danger", label: "Cancelled" },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    return (
      <span className={`status-badge ${badge.color}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Withdrawal Details</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <span className="detail-label">User:</span>
            <span className="detail-value">{transaction.userId.userName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{transaction.userId.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">User Balance:</span>
            <span className="detail-value">
              ${transaction.userId.balance.toFixed(2)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Withdraw Method:</span>
            <span className="detail-value">
              {transaction.withdrawMethodId.methodNameEn} (
              {transaction.withdrawMethodId.methodNameBn})
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Withdrawal Amount:</span>
            <span className="detail-value amount-highlight">
              ${transaction.amount.toFixed(2)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Fee:</span>
            <span className="detail-value" style={{ color: "#fbbf24" }}>
              ${transaction.withdrawalFee.toFixed(2)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Net Amount (User Receives):</span>
            <span className="detail-value" style={{ color: "#22c55e" }}>
              ${transaction.netAmount.toFixed(2)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className="detail-value">
              {getStatusBadge(transaction.status)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Created:</span>
            <span className="detail-value">
              {new Date(transaction.createdAt).toLocaleString()}
            </span>
          </div>

          {transaction.userInputData && (
            <div className="detail-section">
              <div className="detail-label">User Payment Details:</div>
              <div className="user-data">
                {Object.entries(transaction.userInputData).map(
                  ([key, value]) => (
                    <div key={key} className="data-item">
                      <span className="data-key">{key}:</span>
                      <span className="data-value">{String(value)}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="detail-section">
            <label className="detail-label">Admin Note:</label>
            <textarea
              className="admin-note-input"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add a note (e.g., Payment sent to bKash account)..."
              rows={3}
              disabled={transaction.status !== "pending"}
            />
          </div>

          {transaction.adminNote && (
            <div className="detail-section">
              <div className="detail-label">Previous Admin Note:</div>
              <div className="admin-note-display">{transaction.adminNote}</div>
            </div>
          )}
        </div>

        {transaction.status === "pending" && (
          <div className="modal-footer">
            <button
              className="modal-btn approve"
              onClick={() => handleUpdateStatus("approved")}
              disabled={actionLoading}
            >
              <CheckCircle size={18} />
              {actionLoading ? "Processing..." : "Approve & Deduct Balance"}
            </button>
            <button
              className="modal-btn cancel"
              onClick={() => handleUpdateStatus("cancelled")}
              disabled={actionLoading}
            >
              <XCircle size={18} />
              {actionLoading ? "Processing..." : "Cancel"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawDetailsModal;
