import { useState, useEffect } from "react";
import {
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
} from "lucide-react";
import axios from "axios";
import "./AdminDashboard.css";

interface DashboardStats {
  totalUsers: number;
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalFeesCollected: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:8000/api";

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");

      const [balancesRes, depositStatsRes, withdrawStatsRes] =
        await Promise.all([
          axios.get(`${API_URL}/dashboard/users/balances`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get(`${API_URL}/deposit-transactions/admin/statistics`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get(`${API_URL}/withdraw-transactions/admin/statistics`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

      setStats({
        totalUsers: balancesRes.data.count || 0,
        totalBalance: balancesRes.data.totalBalance || 0,
        totalDeposits: depositStatsRes.data.statistics.totalApprovedAmount || 0,
        totalWithdrawals:
          withdrawStatsRes.data.statistics.totalWithdrawnAmount || 0,
        pendingDeposits: depositStatsRes.data.statistics.totalPending || 0,
        pendingWithdrawals: withdrawStatsRes.data.statistics.totalPending || 0,
        totalFeesCollected:
          withdrawStatsRes.data.statistics.totalFeesCollected || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Admin Dashboard</h2>
          <p className="dashboard-subtitle">
            Overview of your platform statistics
          </p>
        </div>
      </div>

      {stats && (
        <>
          {/* Main Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{stats.totalUsers}</div>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon">
                <Wallet size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Balance</div>
                <div className="stat-value">
                  ${stats.totalBalance.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Deposits</div>
                <div className="stat-value">
                  ${stats.totalDeposits.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon">
                <TrendingDown size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Withdrawals</div>
                <div className="stat-value">
                  ${stats.totalWithdrawals.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats Grid */}
          <div className="secondary-stats-grid">
            <div className="stat-card pending">
              <div className="stat-icon">
                <Activity size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Pending Deposits</div>
                <div className="stat-value">{stats.pendingDeposits}</div>
              </div>
            </div>

            <div className="stat-card pending">
              <div className="stat-icon">
                <Activity size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Pending Withdrawals</div>
                <div className="stat-value">{stats.pendingWithdrawals}</div>
              </div>
            </div>

            <div className="stat-card revenue">
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Fees Collected</div>
                <div className="stat-value">
                  ${stats.totalFeesCollected.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3 className="section-title">Quick Actions</h3>
            <div className="actions-grid">
              <a href="/users" className="action-card">
                <Users size={20} />
                <span>Manage Users</span>
              </a>
              <a href="/deposit-transactions" className="action-card">
                <TrendingUp size={20} />
                <span>Deposit Transactions</span>
              </a>
              <a href="/withdraw-transactions" className="action-card">
                <TrendingDown size={20} />
                <span>Withdraw Transactions</span>
              </a>
              <a href="/deposit-methods" className="action-card">
                <Wallet size={20} />
                <span>Payment Methods</span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
