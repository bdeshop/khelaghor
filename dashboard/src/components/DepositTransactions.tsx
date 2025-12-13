import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Eye, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DepositTransactions.css";

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

interface Statistics {
  totalPending: number;
  totalApproved: number;
  totalCancelled: number;
  totalApprovedAmount: number;
}

const DepositTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<DepositTransaction[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const API_URL = "http://localhost:8000/api";

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");
      const url =
        statusFilter === "all"
          ? `${API_URL}/deposit-transactions/admin/all`
          : `${API_URL}/deposit-transactions/admin/all?status=${statusFilter}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/deposit-transactions/admin/statistics`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleViewDetails = (transactionId: string) => {
    navigate(`/deposit-transactions/${transactionId}`);
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
    <div className="deposit-transactions-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Deposit Transactions</h2>
          <p className="page-subtitle">Manage and approve deposit requests</p>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="stats-grid">
          <div className="stat-card warning">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Pending</div>
              <div className="stat-value">{statistics.totalPending}</div>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Approved</div>
              <div className="stat-value">{statistics.totalApproved}</div>
            </div>
          </div>
          <div className="stat-card danger">
            <div className="stat-icon">
              <XCircle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Cancelled</div>
              <div className="stat-value">{statistics.totalCancelled}</div>
            </div>
          </div>
          <div className="stat-card primary">
            <div className="stat-icon">$</div>
            <div className="stat-info">
              <div className="stat-label">Total Approved</div>
              <div className="stat-value">
                ${(statistics.totalApprovedAmount || 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <Filter size={18} />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found</p>
          </div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>User</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="transaction-id">
                    {transaction.transactionId}
                  </td>
                  <td>
                    <div className="user-info">
                      <div className="user-name">
                        {transaction.userId.userName}
                      </div>
                      <div className="user-email">
                        {transaction.userId.phone}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="method-info">
                      <div className="method-name">
                        {transaction.depositMethodId.method_name_en}
                      </div>
                      <div className="method-type">
                        {transaction.depositMethodId.method_name_bd}
                      </div>
                    </div>
                  </td>
                  <td className="amount">${transaction.amount.toFixed(2)}</td>
                  <td>{getStatusBadge(transaction.status)}</td>
                  <td className="date">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="action-btn view"
                      onClick={() => handleViewDetails(transaction._id)}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DepositTransactions;
