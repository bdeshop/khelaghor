import { useUser } from "../context/UserContext";
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Flame,
  Check,
  X,
  Gift,
} from "lucide-react";

function Dashboard() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <>
      {/* Welcome Message */}
      <div className="welcome-section">
        <h1 className="welcome-title">
          Welcome back,{" "}
          <span className="highlight">{user?.name || "User"}</span>!
        </h1>
        <p className="welcome-subtitle">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Bets</div>
            <div className="stat-icon green">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-value">1,284</div>
          <div className="stat-change positive">
            <TrendingUp size={14} />
            <span>12.5% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Win Rate</div>
            <div className="stat-icon blue">
              <Target size={20} />
            </div>
          </div>
          <div className="stat-value">68.4%</div>
          <div className="stat-change positive">
            <TrendingUp size={14} />
            <span>5.2% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Profit</div>
            <div className="stat-icon orange">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-value">$8,942</div>
          <div className="stat-change positive">
            <TrendingUp size={14} />
            <span>18.3% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Active Bets</div>
            <div className="stat-icon red">
              <Flame size={20} />
            </div>
          </div>
          <div className="stat-value">23</div>
          <div className="stat-change negative">
            <TrendingDown size={14} />
            <span>3 from yesterday</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Live Bets */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Live Bets</h2>
            <a href="#" className="card-action">
              View All →
            </a>
          </div>

          <div className="bet-list">
            <div className="bet-item">
              <div className="bet-header">
                <div className="bet-teams">Lakers vs Warriors</div>
                <span className="bet-status live">LIVE</span>
              </div>
              <div className="bet-details">
                <span>🏀 NBA</span>
                <span>•</span>
                <span>Q3 - 8:42</span>
                <span>•</span>
                <span
                  style={{
                    color: "var(--accent-primary)",
                    fontWeight: 600,
                  }}
                >
                  $250
                </span>
              </div>
            </div>

            <div className="bet-item">
              <div className="bet-header">
                <div className="bet-teams">Real Madrid vs Barcelona</div>
                <span className="bet-status live">LIVE</span>
              </div>
              <div className="bet-details">
                <span>⚽ La Liga</span>
                <span>•</span>
                <span>67'</span>
                <span>•</span>
                <span
                  style={{
                    color: "var(--accent-primary)",
                    fontWeight: 600,
                  }}
                >
                  $500
                </span>
              </div>
            </div>

            <div className="bet-item">
              <div className="bet-header">
                <div className="bet-teams">Djokovic vs Nadal</div>
                <span className="bet-status upcoming">UPCOMING</span>
              </div>
              <div className="bet-details">
                <span>🎾 Tennis</span>
                <span>•</span>
                <span>Starts in 2h</span>
                <span>•</span>
                <span
                  style={{
                    color: "var(--accent-primary)",
                    fontWeight: 600,
                  }}
                >
                  $150
                </span>
              </div>
            </div>

            <div className="bet-item">
              <div className="bet-header">
                <div className="bet-teams">Chiefs vs Bills</div>
                <span className="bet-status upcoming">UPCOMING</span>
              </div>
              <div className="bet-details">
                <span>🏈 NFL</span>
                <span>•</span>
                <span>Tomorrow 8:00 PM</span>
                <span>•</span>
                <span
                  style={{
                    color: "var(--accent-primary)",
                    fontWeight: 600,
                  }}
                >
                  $300
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
            <a href="#" className="card-action">
              View All →
            </a>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon green">
                <Check size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Bet Won</div>
                <div className="activity-time">2 minutes ago</div>
              </div>
              <div
                className="activity-amount"
                style={{ color: "var(--accent-primary)" }}
              >
                +$420
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon blue">
                <DollarSign size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Deposit</div>
                <div className="activity-time">1 hour ago</div>
              </div>
              <div
                className="activity-amount"
                style={{ color: "var(--text-secondary)" }}
              >
                +$1,000
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon red">
                <X size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Bet Lost</div>
                <div className="activity-time">3 hours ago</div>
              </div>
              <div
                className="activity-amount"
                style={{ color: "var(--accent-danger)" }}
              >
                -$150
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon green">
                <Check size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Bet Won</div>
                <div className="activity-time">5 hours ago</div>
              </div>
              <div
                className="activity-amount"
                style={{ color: "var(--accent-primary)" }}
              >
                +$680
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon orange">
                <Gift size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Bonus Received</div>
                <div className="activity-time">Yesterday</div>
              </div>
              <div
                className="activity-amount"
                style={{ color: "var(--accent-warning)" }}
              >
                +$50
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
