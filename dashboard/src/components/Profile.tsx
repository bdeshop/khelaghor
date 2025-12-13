import { useState } from "react";
import { useUser } from "../context/UserContext";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit,
  Camera,
  Award,
  TrendingUp,
  X,
  Save,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { updateProfile, changePassword } from "../config/api";
import "./Profile.css";

function Profile() {
  const { user, fetchUser } = useUser();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  if (!user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    const names = user.name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  const handleProfileEdit = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditingProfile(true);
    setMessage(null);
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setMessage(null);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateProfile(profileData);
      await fetchUser();
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditingProfile(false);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      await changePassword(passwordData);
      setMessage({ type: "success", text: "Password changed successfully!" });
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header-section">
        <div className="profile-banner">
          <div className="banner-gradient"></div>
        </div>

        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {getUserInitials()}
              <button className="avatar-edit-btn">
                <Camera size={18} />
              </button>
            </div>
          </div>

          <div className="profile-header-info">
            <h1 className="profile-name">{user?.name || "User"}</h1>
            <div className="profile-role-badge">
              <Shield size={16} />
              <span>{user?.role?.toUpperCase() || "USER"}</span>
            </div>
          </div>

          <button className="profile-edit-btn" onClick={handleProfileEdit}>
            <Edit size={18} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <div className="profile-content">
        {message && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-grid">
          {/* Personal Information Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h2 className="profile-card-title">Personal Information</h2>
              {!isEditingProfile && (
                <button className="edit-btn-small" onClick={handleProfileEdit}>
                  <Edit size={16} />
                </button>
              )}
            </div>
            <div className="profile-card-body">
              {isEditingProfile ? (
                <form
                  onSubmit={handleProfileSubmit}
                  className="profile-edit-form"
                >
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleProfileCancel}
                      disabled={loading}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-save"
                      disabled={loading}
                    >
                      <Save size={16} />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <User size={20} />
                    </div>
                    <div className="profile-info-content">
                      <div className="profile-info-label">Full Name</div>
                      <div className="profile-info-value">
                        {user?.name || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <Mail size={20} />
                    </div>
                    <div className="profile-info-content">
                      <div className="profile-info-label">Email Address</div>
                      <div className="profile-info-value">
                        {user?.email || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <Shield size={20} />
                    </div>
                    <div className="profile-info-content">
                      <div className="profile-info-label">Account Role</div>
                      <div className="profile-info-value">
                        <span className="role-badge-inline">{user.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-info-item">
                    <div className="profile-info-icon">
                      <Calendar size={20} />
                    </div>
                    <div className="profile-info-content">
                      <div className="profile-info-label">Member Since</div>
                      <div className="profile-info-value">
                        {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Account Stats Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h2 className="profile-card-title">Account Statistics</h2>
            </div>
            <div className="profile-card-body">
              <div className="profile-stat-item">
                <div className="profile-stat-icon green">
                  <TrendingUp size={24} />
                </div>
                <div className="profile-stat-content">
                  <div className="profile-stat-value">1,284</div>
                  <div className="profile-stat-label">Total Bets</div>
                </div>
              </div>

              <div className="profile-stat-item">
                <div className="profile-stat-icon blue">
                  <Award size={24} />
                </div>
                <div className="profile-stat-content">
                  <div className="profile-stat-value">68.4%</div>
                  <div className="profile-stat-label">Win Rate</div>
                </div>
              </div>

              <div className="profile-stat-item">
                <div className="profile-stat-icon orange">
                  <TrendingUp size={24} />
                </div>
                <div className="profile-stat-content">
                  <div className="profile-stat-value">$8,942</div>
                  <div className="profile-stat-label">Total Profit</div>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h2 className="profile-card-title">Security</h2>
              {!isChangingPassword && (
                <button
                  className="edit-btn-small"
                  onClick={() => {
                    setIsChangingPassword(true);
                    setMessage(null);
                  }}
                >
                  <Lock size={16} />
                </button>
              )}
            </div>
            <div className="profile-card-body">
              {isChangingPassword ? (
                <form
                  onSubmit={handlePasswordSubmit}
                  className="profile-edit-form"
                >
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            current: !showPasswords.current,
                          })
                        }
                      >
                        {showPasswords.current ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            new: !showPasswords.new,
                          })
                        }
                      >
                        {showPasswords.new ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            confirm: !showPasswords.confirm,
                          })
                        }
                      >
                        {showPasswords.confirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setShowPasswords({
                          current: false,
                          new: false,
                          confirm: false,
                        });
                        setMessage(null);
                      }}
                      disabled={loading}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-save"
                      disabled={loading}
                    >
                      <Save size={16} />
                      {loading ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <Lock size={20} />
                  </div>
                  <div className="profile-info-content">
                    <div className="profile-info-label">Password</div>
                    <div className="profile-info-value">••••••••</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Details Card */}
          <div className="profile-card full-width">
            <div className="profile-card-header">
              <h2 className="profile-card-title">Account Details</h2>
            </div>
            <div className="profile-card-body">
              <div className="profile-details-grid">
                <div className="profile-detail-item">
                  <div className="profile-detail-label">User ID</div>
                  <div className="profile-detail-value">{user.id}</div>
                </div>
                <div className="profile-detail-item">
                  <div className="profile-detail-label">Account Status</div>
                  <div className="profile-detail-value">
                    <span className="status-badge active">Active</span>
                  </div>
                </div>
                <div className="profile-detail-item">
                  <div className="profile-detail-label">Email Verified</div>
                  <div className="profile-detail-value">
                    <span className="status-badge verified">Verified</span>
                  </div>
                </div>
                <div className="profile-detail-item">
                  <div className="profile-detail-label">Two-Factor Auth</div>
                  <div className="profile-detail-value">
                    <span className="status-badge disabled">Disabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
