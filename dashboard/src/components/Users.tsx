import { useState, useEffect } from "react";
import { getAllUsers } from "../config/api";
import {
  Users as UsersIcon,
  Search,
  Filter,
  Download,
  RefreshCw,
  Shield,
  User,
  Calendar,
  Edit,
  Trash2,
  Phone,
  DollarSign,
  Gift,
} from "lucide-react";
import EditUserModal from "./EditUserModal";
import "./Users.css";

interface User {
  id: string;
  userName: string;
  myReferralCode: string;
  phone: number;
  callingCode: string;
  balance: number;
  friendReferrerCode: string;
  referredBy: string;
  role: "user" | "admin";
  createdAt: string;
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllUsers();
      // Handle response structure: { success: true, count: 1, users: [...] }
      const usersData = response.users || response;
      setUsers(usersData);
      console.log("Users fetched successfully:", response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.userName}?`)) {
      console.log("Delete user:", user);
      // TODO: Implement delete functionality
      alert(`Delete user: ${user.userName}`);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleUpdateSuccess = () => {
    // Refresh the users list after successful update
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getUserInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toString().includes(searchTerm) ||
      user.myReferralCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    users: users.filter((u) => u.role === "user").length,
  };

  return (
    <div className="users-container">
      {/* Header */}
      <div className="users-header">
        <div className="users-header-content">
          <div className="users-header-icon">
            <UsersIcon size={32} />
          </div>
          <div>
            <h1 className="users-title">Khelaghor Users</h1>
            <p className="users-subtitle">
              Manage and view all registered users
            </p>
          </div>
        </div>
        <button className="refresh-btn" onClick={fetchUsers} disabled={loading}>
          <RefreshCw size={18} className={loading ? "spinning" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="users-stats">
        <div className="users-stat-card">
          <div className="users-stat-icon total">
            <UsersIcon size={24} />
          </div>
          <div className="users-stat-content">
            <div className="users-stat-value">{stats.total}</div>
            <div className="users-stat-label">Total Users</div>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon admin">
            <Shield size={24} />
          </div>
          <div className="users-stat-content">
            <div className="users-stat-value">{stats.admins}</div>
            <div className="users-stat-label">Admins</div>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon user">
            <User size={24} />
          </div>
          <div className="users-stat-content">
            <div className="users-stat-value">{stats.users}</div>
            <div className="users-stat-label">Regular Users</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="users-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-users"
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            value={filterRole}
            onChange={(e) =>
              setFilterRole(e.target.value as "all" | "admin" | "user")
            }
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <button className="export-btn">
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="users-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="users-loading">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Phone</th>
                  <th>Referral Code</th>
                  <th>Balance</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="no-data">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-small">
                            {getUserInitials(user.userName)}
                          </div>
                          <div className="user-info">
                            <div className="user-name">{user.userName}</div>
                            {user.referredBy && (
                              <div className="user-referred">
                                <Gift size={12} />
                                Referred
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="phone-cell">
                          <Phone size={16} />
                          <span>
                            +{user.callingCode} {user.phone}
                          </span>
                        </div>
                      </td>
                      <td>
                        <code className="referral-code">
                          {user.myReferralCode}
                        </code>
                      </td>
                      <td>
                        <div className="balance-cell">
                          <DollarSign size={16} />
                          <span className="balance-amount">
                            {user.balance.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge-table ${user.role}`}>
                          {user.role === "admin" ? (
                            <Shield size={14} />
                          ) : (
                            <User size={14} />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <div className="date-cell">
                          <Calendar size={16} />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(user)}
                            title="Edit user"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(user)}
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Results Count */}
          <div className="users-footer">
            <p className="results-count">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}

export default Users;
