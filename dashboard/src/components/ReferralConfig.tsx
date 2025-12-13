import { useState, useEffect } from "react";
import {
  Settings,
  DollarSign,
  Users,
  Gift,
  TrendingUp,
  Save,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import "./ReferralConfig.css";

interface RewardConfig {
  _id?: string;
  dailyRewardAmount: number;
  referralBonusAmount: number;
  minimumClaimAmount: number;
  isActive: boolean;
}

interface Statistics {
  totalUsers: number;
  usersWithReferrals: number;
  totalRewardsGenerated: number;
  totalRewardsClaimed: number;
  totalRewardAmount: number;
  totalClaimedAmount: number;
  pendingRewardAmount: number;
}

const ReferralConfig = () => {
  const [config, setConfig] = useState<RewardConfig>({
    dailyRewardAmount: 10,
    referralBonusAmount: 50,
    minimumClaimAmount: 10,
    isActive: true,
  });
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState("");
  const [generating, setGenerating] = useState(false);

  const API_URL = "http://localhost:8000/api";

  useEffect(() => {
    fetchConfig();
    fetchStatistics();
  }, []);

  const fetchConfig = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/referrals/admin/config`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setConfig(response.data.config);
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_URL}/referrals/admin/statistics`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleUpdateConfig = async () => {
    try {
      setSaving(true);
      const authToken = localStorage.getItem("authToken");
      await axios.put(`${API_URL}/referrals/admin/config`, config, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert("Configuration updated successfully!");
      fetchConfig();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Error updating configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateReward = async () => {
    if (!userId.trim()) {
      alert("Please enter a user ID");
      return;
    }

    try {
      setGenerating(true);
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/referrals/admin/generate-daily-reward`,
        { userId },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      alert("Daily reward generated successfully!");
      setUserId("");
      fetchStatistics();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Error generating reward");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="referral-config-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Referral & Rewards Configuration</h2>
          <p className="page-subtitle">
            Manage reward amounts and system settings
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{statistics.totalUsers}</div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <Gift size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Rewards Generated</div>
              <div className="stat-value">
                {statistics.totalRewardsGenerated}
              </div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Rewards Claimed</div>
              <div className="stat-value">{statistics.totalRewardsClaimed}</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Reward Amount</div>
              <div className="stat-value">
                ${statistics.totalRewardAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="stat-card claimed">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Total Claimed</div>
              <div className="stat-value">
                ${statistics.totalClaimedAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">Pending Amount</div>
              <div className="stat-value">
                ${statistics.pendingRewardAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="config-grid">
        {/* Configuration Card */}
        <div className="config-card">
          <div className="card-header">
            <Settings size={20} />
            <h3>Reward Configuration</h3>
          </div>

          <div className="form-group">
            <label className="form-label">
              Daily Reward Amount ($)
              <span className="label-hint">
                Amount users earn per daily reward
              </span>
            </label>
            <input
              type="number"
              className="form-input"
              value={config.dailyRewardAmount}
              onChange={(e) =>
                setConfig({
                  ...config,
                  dailyRewardAmount: Number(e.target.value),
                })
              }
              min="0"
              step="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Referral Bonus Amount ($)
              <span className="label-hint">Bonus for referring friends</span>
            </label>
            <input
              type="number"
              className="form-input"
              value={config.referralBonusAmount}
              onChange={(e) =>
                setConfig({
                  ...config,
                  referralBonusAmount: Number(e.target.value),
                })
              }
              min="0"
              step="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Minimum Claim Amount ($)
              <span className="label-hint">
                Minimum rewards needed before user can claim
              </span>
            </label>
            <input
              type="number"
              className="form-input"
              value={config.minimumClaimAmount}
              onChange={(e) =>
                setConfig({
                  ...config,
                  minimumClaimAmount: Number(e.target.value),
                })
              }
              min="0"
              step="1"
            />
          </div>

          <div className="form-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                className="toggle-input"
                checked={config.isActive}
                onChange={(e) =>
                  setConfig({ ...config, isActive: e.target.checked })
                }
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                Reward System {config.isActive ? "Active" : "Inactive"}
              </span>
            </label>
          </div>

          <button
            className="save-btn"
            onClick={handleUpdateConfig}
            disabled={saving}
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>

        {/* Generate Reward Card */}
        <div className="config-card">
          <div className="card-header">
            <Gift size={20} />
            <h3>Generate Daily Reward</h3>
          </div>

          <div className="form-group">
            <label className="form-label">
              User ID
              <span className="label-hint">
                Enter the user ID to generate reward for
              </span>
            </label>
            <input
              type="text"
              className="form-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="65abc123def456..."
            />
          </div>

          <div className="info-box">
            <p>
              <strong>Note:</strong> You can only generate one reward per user
              per day. The reward amount will be based on the current
              configuration (${config.dailyRewardAmount}).
            </p>
          </div>

          <button
            className="generate-btn"
            onClick={handleGenerateReward}
            disabled={generating || !userId.trim()}
          >
            <RefreshCw size={18} />
            {generating ? "Generating..." : "Generate Reward"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralConfig;
