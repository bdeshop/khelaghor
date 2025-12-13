import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import axios from "axios";
import "./WithdrawTransactionDetail.css";

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

const WithdrawTransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<WithdrawTransaction | null>(
    null
  );
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const API_URL = "http://localhost:8000/api";

  useEffect(() => {
    fetchTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/withdraw-transactions/admin/all`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const found = response.data.transactions.find(
        (t: WithdrawTransaction) => t._id === id
      );
      setTransaction(found || null);
    } catch (error) {
      console.error("Error fetching transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: "approved" | "cancelled") => {
    if (!transaction) return;

    try {
      setActionLoading(true);
      const authToken = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}/withdraw-transactions/admin/${transaction._id}`,
        { status, adminNote },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      alert(`Withdrawal ${status} successfully!`);
      navigate("/withdraw-transactions");
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
        <Icon size={16} />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading transaction details...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="error-container">
        <p>Transaction not found</p>
        <button
          className="back-btn"
          onClick={() => navigate("/withdraw-transactions")}
        >
          <ArrowLeft size={18} />
          Back to Transactions
        </button>
      </div>
    );
  }

  return (
    <div className="withdraw-detail-container">
      <div className="detail-header">
        <button
          className="back-btn"
          onClick={() => navigate("/withdraw-transactions")}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h2 className="detail-title">Withdrawal Details</h2>
      </div>

      <div className="detail-card">
        <div className="detail-section">
          <h3 className="section-title">Transaction Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value">
                {getStatusBadge(transaction.status)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created Date</span>
              <span className="detail-value">
                {new Date(transaction.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3 className="section-title">User Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Username</span>
              <span className="detail-value">
                {transaction.userId.userName}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{transaction.userId.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Current Balance</span>
              <span className="detail-value balance">
                ${transaction.userId.balance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3 className="section-title">Withdrawal Method</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Method (English)</span>
              <span className="detail-value">
                {transaction.withdrawMethodId.methodNameEn}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Method (Bengali)</span>
              <span className="detail-value">
                {transaction.withdrawMethodId.methodNameBn}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3 className="section-title">Amount Details</h3>
          <div className="amount-breakdown">
            <div className="amount-row">
              <span className="amount-label">Withdrawal Amount</span>
              <span className="amount-value primary">
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
            <div className="amount-row">
              <span className="amount-label">Fee</span>
              <span className="amount-value warning">
                -${transaction.withdrawalFee.toFixed(2)}
              </span>
            </div>
            <div className="amount-row total">
              <span className="amount-label">Net Amount (User Receives)</span>
              <span className="amount-value success">
                ${transaction.netAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {transaction.userInputData &&
          Object.keys(transaction.userInputData).length > 0 && (
            <div className="detail-section">
              <h3 className="section-title">User Payment Details</h3>
              <div className="user-data-grid">
                {Object.entries(transaction.userInputData).map(
                  ([key, value]) => (
                    <div key={key} className="detail-item">
                      <span className="detail-label">{key}</span>
                      <span className="detail-value">{String(value)}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {transaction.adminNote && (
          <div className="detail-section">
            <h3 className="section-title">Previous Admin Note</h3>
            <div className="admin-note-display">{transaction.adminNote}</div>
          </div>
        )}

        {transaction.status === "pending" && (
          <div className="detail-section">
            <h3 className="section-title">Admin Actions</h3>
            <div className="admin-actions">
              <textarea
                className="admin-note-input"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note (e.g., Payment sent to bKash account)..."
                rows={4}
              />
              <div className="action-buttons">
                <button
                  className="action-btn approve"
                  onClick={() => handleUpdateStatus("approved")}
                  disabled={actionLoading}
                >
                  <CheckCircle size={18} />
                  {actionLoading ? "Processing..." : "Approve & Deduct Balance"}
                </button>
                <button
                  className="action-btn cancel"
                  onClick={() => handleUpdateStatus("cancelled")}
                  disabled={actionLoading}
                >
                  <XCircle size={18} />
                  {actionLoading ? "Processing..." : "Cancel Withdrawal"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawTransactionDetail;
