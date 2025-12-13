import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";
import { apiRequest, API_ENDPOINTS } from "../config/api";
import "./Login.css";

interface RegisterProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

function Register({ onRegister, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiRequest(API_ENDPOINTS.REGISTER, "POST", {
        name,
        email,
        password,
        role,
      });

      console.log("Registration successful:", response);

      // Store token if provided
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      setIsLoading(false);
      onRegister();
    } catch (err) {
      setIsLoading(false);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon-large">B</div>
            </div>
            <h1 className="login-title">Create Account</h1>
            <p className="login-subtitle">
              Join us and start your betting journey
            </p>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div className="role-selector">
                <label
                  className={`role-option ${role === "user" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value as "user")}
                  />
                  <div className="role-content">
                    <span className="role-icon">👤</span>
                    <span className="role-name">User</span>
                  </div>
                </label>
                <label
                  className={`role-option ${role === "admin" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value as "admin")}
                  />
                  <div className="role-content">
                    <span className="role-icon">👑</span>
                    <span className="role-name">Admin</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={`login-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Already have an account?{" "}
              <button onClick={onSwitchToLogin} className="signup-link">
                Sign in
              </button>
            </p>
          </div>
        </div>

        <div className="login-features">
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <h3>Live Betting</h3>
            <p>Real-time odds on thousands of events</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💰</div>
            <h3>Instant Payouts</h3>
            <p>Fast and secure withdrawals</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>Bank-level encryption & security</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
