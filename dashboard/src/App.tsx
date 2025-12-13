import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  Radio,
  Trophy,
  Dices,
  Ticket,
  Wallet,
  History,
  Settings as SettingsIcon,
  Menu,
  Search,
  Bell,
  LogOut,
  User as UserIcon,
  Users as UsersIcon,
  Image as ImageIcon,
  Heart,
  Gamepad2,
  Layout,
  Smartphone,
  CreditCard,
  Gift,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useUser } from "./context/UserContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Users from "./components/Users";
import Banners from "./components/Banners";
import Favourites from "./components/Favourites";
import PopularGames from "./components/PopularGames";
import FooterManagement from "./components/FooterManagement";
import AppVersion from "./components/AppVersion";
import Settings from "./components/Settings";
import Games from "./components/Games";
import DepositMethods from "./components/DepositMethods";
import Promotions from "./components/Promotions";
import WithdrawalMethods from "./components/WithdrawalMethods";
import Transactions from "./components/Transactions";
import DepositTransactions from "./components/DepositTransactions";
import DepositTransactionDetail from "./components/DepositTransactionDetail";
import WithdrawTransactions from "./components/WithdrawTransactions";
import WithdrawTransactionDetail from "./components/WithdrawTransactionDetail";
import AdminDashboard from "./components/AdminDashboard";
import ReferralConfig from "./components/ReferralConfig";
import ThemeConfig from "./components/ThemeConfig";
import "./App.css";

function App() {
  const { user, loading, fetchUser, logout } = useUser();
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    deposits: false,
    withdrawals: false,
  });

  // Get active nav from current route
  const getActiveNav = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/users")) return "users";
    if (path.startsWith("/banners")) return "banners";
    if (path.startsWith("/favourites")) return "favourites";
    if (path.startsWith("/popular-games")) return "popular-games";
    if (path.startsWith("/footer-management")) return "footer-management";
    if (path.startsWith("/app-version")) return "app-version";
    if (path.startsWith("/games")) return "games";
    if (path.startsWith("/admin-dashboard")) return "admin-dashboard";
    if (path.startsWith("/referral-config")) return "referral-config";
    if (path.startsWith("/theme-config")) return "theme-config";
    if (path.startsWith("/deposit-methods")) return "deposit-methods";
    if (path.startsWith("/deposit-transactions")) return "deposit-transactions";
    if (path.startsWith("/withdraw-transactions"))
      return "withdraw-transactions";
    if (path.startsWith("/withdrawal-methods")) return "withdrawal-methods";
    if (path.startsWith("/promotions")) return "promotions";
    if (path.startsWith("/transactions")) return "transactions";
    if (path.startsWith("/live")) return "live";
    if (path.startsWith("/sports")) return "sports";
    if (path.startsWith("/casino")) return "casino";
    if (path.startsWith("/mybets")) return "mybets";
    if (path.startsWith("/wallet")) return "wallet";
    if (path.startsWith("/history")) return "history";
    if (path.startsWith("/settings")) return "settings";
    return "dashboard";
  };

  const activeNav = getActiveNav();

  const handleLogin = async () => {
    await fetchUser();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show auth pages if not logged in
  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegister={handleLogin}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    const names = user.name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  const navItems = [
    { id: "dashboard", path: "/", icon: LayoutDashboard, label: "Dashboard" },
    {
      id: "transactions",
      path: "/transactions",
      icon: CreditCard,
      label: "Transactions",
    },
    {
      id: "live",
      path: "/live",
      icon: Radio,
      label: "Live Betting",
      badge: "12",
    },
    { id: "sports", path: "/sports", icon: Trophy, label: "Sports" },
    { id: "casino", path: "/casino", icon: Dices, label: "Casino" },
    { id: "mybets", path: "/mybets", icon: Ticket, label: "My Bets" },
  ];

  // Admin-only nav items
  const adminNavItems =
    user.role === "admin"
      ? [
          {
            id: "admin-dashboard",
            path: "/admin-dashboard",
            icon: LayoutDashboard,
            label: "Admin Dashboard",
          },
          {
            id: "users",
            path: "/users",
            icon: UsersIcon,
            label: "Khelaghor Users",
          },
          {
            id: "banners",
            path: "/banners",
            icon: ImageIcon,
            label: "Banners",
          },
          {
            id: "favourites",
            path: "/favourites",
            icon: Heart,
            label: "Favourites",
          },
          {
            id: "popular-games",
            path: "/popular-games",
            icon: Gamepad2,
            label: "Popular Games",
          },
          {
            id: "footer-management",
            path: "/footer-management",
            icon: Layout,
            label: "Footer Management",
          },
          {
            id: "app-version",
            path: "/app-version",
            icon: Smartphone,
            label: "App Version",
          },
          {
            id: "games",
            path: "/games",
            icon: Gamepad2,
            label: "Games",
          },
          {
            id: "promotions",
            path: "/promotions",
            icon: Gift,
            label: "Promotions",
          },
          {
            id: "referral-config",
            path: "/referral-config",
            icon: Gift,
            label: "Referral Config",
          },
          {
            id: "theme-config",
            path: "/theme-config",
            icon: SettingsIcon,
            label: "Theme Config",
          },
        ]
      : [];

  const depositMenuItems = [
    {
      id: "deposit-methods",
      path: "/deposit-methods",
      label: "Deposit Methods",
    },
    {
      id: "deposit-transactions",
      path: "/deposit-transactions",
      label: "Deposit Transactions",
    },
  ];

  const withdrawalMenuItems = [
    {
      id: "withdrawal-methods",
      path: "/withdrawal-methods",
      label: "Withdrawal Methods",
    },
    {
      id: "withdraw-transactions",
      path: "/withdraw-transactions",
      label: "Withdraw Transactions",
    },
  ];

  const accountItems = [
    { id: "profile", path: "/profile", icon: UserIcon, label: "Profile" },
    { id: "wallet", path: "/wallet", icon: Wallet, label: "Wallet" },
    { id: "history", path: "/history", icon: History, label: "History" },
    {
      id: "settings",
      path: "/settings",
      icon: SettingsIcon,
      label: "Settings",
    },
  ];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? "" : "collapsed"} ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="logo-icon">k</div>
          <div className="logo-text">Khelaghor</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Menu</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`nav-item ${
                    activeNav === item.id ? "active" : ""
                  }`}
                  onClick={() => handleNavClick(item.path)}
                >
                  <span className="nav-icon">
                    <Icon size={20} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Admin Section */}
          {adminNavItems.length > 0 && (
            <div className="nav-section">
              <div className="nav-section-title">Admin</div>
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`nav-item ${
                      activeNav === item.id ? "active" : ""
                    }`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    <span className="nav-icon">
                      <Icon size={20} />
                    </span>
                    <span className="nav-label">{item.label}</span>
                  </div>
                );
              })}

              {/* Deposits Submenu */}
              <div
                className={`nav-item ${
                  activeNav === "deposit-methods" ||
                  activeNav === "deposit-transactions"
                    ? "active"
                    : ""
                }`}
                onClick={() => toggleSubmenu("deposits")}
              >
                <span className="nav-icon">
                  <CreditCard size={20} />
                </span>
                <span className="nav-label">Deposits</span>
                <span className="nav-arrow">
                  {expandedMenus.deposits ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
              </div>
              {expandedMenus.deposits && (
                <div className="submenu">
                  {depositMenuItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      className={`nav-item submenu-item ${
                        activeNav === subItem.id ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavClick(subItem.path);
                      }}
                    >
                      <span className="nav-label">{subItem.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Withdrawals Submenu */}
              <div
                className={`nav-item ${
                  activeNav === "withdrawal-methods" ||
                  activeNav === "withdraw-transactions"
                    ? "active"
                    : ""
                }`}
                onClick={() => toggleSubmenu("withdrawals")}
              >
                <span className="nav-icon">
                  <Wallet size={20} />
                </span>
                <span className="nav-label">Withdrawals</span>
                <span className="nav-arrow">
                  {expandedMenus.withdrawals ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
              </div>
              {expandedMenus.withdrawals && (
                <div className="submenu">
                  {withdrawalMenuItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      className={`nav-item submenu-item ${
                        activeNav === subItem.id ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavClick(subItem.path);
                      }}
                    >
                      <span className="nav-label">{subItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="nav-section">
            <div className="nav-section-title">Account</div>
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`nav-item ${
                    activeNav === item.id ? "active" : ""
                  }`}
                  onClick={() => handleNavClick(item.path)}
                >
                  <span className="nav-icon">
                    <Icon size={20} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </div>
              );
            })}

            <div className="nav-item" onClick={handleLogout}>
              <span className="nav-icon">
                <LogOut size={20} />
              </span>
              <span className="nav-label">Logout</span>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`main-content ${!sidebarOpen ? "expanded" : ""}`}>
        {/* Navbar */}
        <nav className="navbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>

          <div className="search-bar">
            <span className="search-icon">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search games, sports, events..."
            />
          </div>

          <div className="navbar-actions">
            <div className="wallet-balance">
              <div>
                <div className="balance-label">Balance</div>
                <div className="balance-amount">$2,450.00</div>
              </div>
            </div>

            <button className="icon-button">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>

            <div
              className="user-avatar"
              title={`${user?.name || "User"} (${user?.role || "user"})`}
            >
              {getUserInitials()}
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/referral-config" element={<ReferralConfig />} />
            <Route path="/theme-config" element={<ThemeConfig />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<Users />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/popular-games" element={<PopularGames />} />
            <Route path="/footer-management" element={<FooterManagement />} />
            <Route path="/app-version" element={<AppVersion />} />
            <Route path="/games" element={<Games />} />
            <Route path="/deposit-methods" element={<DepositMethods />} />
            <Route
              path="/deposit-transactions"
              element={<DepositTransactions />}
            />
            <Route
              path="/deposit-transactions/:id"
              element={<DepositTransactionDetail />}
            />
            <Route
              path="/withdraw-transactions"
              element={<WithdrawTransactions />}
            />
            <Route
              path="/withdraw-transactions/:id"
              element={<WithdrawTransactionDetail />}
            />
            <Route path="/withdrawal-methods" element={<WithdrawalMethods />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/live" element={<div>Live Betting Page</div>} />
            <Route path="/sports" element={<div>Sports Page</div>} />
            <Route path="/casino" element={<div>Casino Page</div>} />
            <Route path="/mybets" element={<div>My Bets Page</div>} />
            <Route path="/wallet" element={<div>Wallet Page</div>} />
            <Route path="/history" element={<div>History Page</div>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
