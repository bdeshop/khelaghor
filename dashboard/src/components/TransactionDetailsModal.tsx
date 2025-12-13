import { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import axios from "axios";
import "./TransactionDetailsModal.css";

interface DepositTransaction {
  _id: string;
  userId: {
    _id: string;
    userName: string;
    phone: number;
    balance: number;
  };
  depositMethodId: {
    _id: string;
    method_name_en: string;
    method_name_bd: string;
  };
  transactionId: string;
  amount: number;
  status: "pending" | "approved" | "cancelled";
  userInputData?: Record<string, unknown>;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: DepositTransaction | null;
  onSuccess: () => void;
}

const TransactionDetailsModal = ({
  isOpen,
  onClose,
  transaction,
  onSuccess,
}: TransactionDetailsModalProps) => {
  const [adminNote, setAdminNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const API_URL = "http://localhost:8000/api";

  if (!isOpen || !transaction) return null;

  const handleUpdateStatus = async (status: "approved" | "cancelled") => {
    try {
      setActionLoading(true);
      const authToken = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/deposit-transactions/admin/${transaction._id}`,
        { status, adminNote },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      onSuccess();
      onClose();
      alert(`Transaction ${status} successfully!`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Error updating transaction");
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
          <h3>Transaction Details</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <span className="detail-label">Transaction ID:</span>
            <span className="detail-value">{transaction.transactionId}</span>
          </div>
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
            <span className="detail-label">Deposit Method:</span>
            <span className="detail-value">
              {transaction.depositMethodId.method_name_en} (
              {transaction.depositMethodId.method_name_bd})
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Amount:</span>
            <span className="detail-value amount-highlight">
              ${transaction.amount.toFixed(2)}
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
              <div className="detail-label">User Input Data:</div>
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
              placeholder="Add a note about this transaction..."
              rows={3}
              disabled={transaction.status !== "pending"}
            />
          </div>
        </div>

        {transaction.status === "pending" && (
          <div className="modal-footer">
            <button
              className="modal-btn approve"
              onClick={() => handleUpdateStatus("approved")}
              disabled={actionLoading}
            >
              <CheckCircle size={18} />
              {actionLoading ? "Processing..." : "Approve"}
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

export default TransactionDetailsModal;
