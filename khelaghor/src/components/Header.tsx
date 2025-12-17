import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { LoginModal } from "@/components/LoginModal";
import { SignUpModal } from "@/components/SignUpModal";
import { CurrencyLanguageModal } from "@/components/CurrencyLanguageModal";
import { PersonalInfoModal } from "@/components/PersonalInfoModal";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { InboxModal } from "@/components/InboxModal";
import { FundsModal } from "@/components/FundsModal";
import { FreeSpinModal } from "@/components/FreeSpinModal";
import { BettingRecordsModal } from "@/components/BettingRecordsModal";
import { API_BASE_URL } from "@/config/api";
import { TransactionRecordsModal } from "@/components/TransactionRecordsModal";
import { TurnoverModal } from "@/components/TurnoverModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { THEME_CONFIG } from "@/constants/theme";
import {
  CreditCard,
  User,
  RefreshCw,
  Wallet,
  Gift,
  FileText,
  Target,
  Receipt,
  UserCircle,
  Lock,
  Mail,
  LogOut,
} from "lucide-react";

interface UserData {
  id: string;
  userName: string;
  myReferralCode: string;
  phone: number;
  callingCode: string;
  balance: number;
  role: string;
}

export function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isFundsOpen, setIsFundsOpen] = useState(false);
  const [isFreeSpinOpen, setIsFreeSpinOpen] = useState(false);
  const [isBettingRecordsOpen, setIsBettingRecordsOpen] = useState(false);
  const [isTransactionRecordsOpen, setIsTransactionRecordsOpen] =
    useState(false);
  const [isTurnoverOpen, setIsTurnoverOpen] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const user = useMemo<UserData | null>(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  }, []);

  const fetchBalance = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBalance(data.balance);
        // Update user in localStorage with new balance
        const userData = localStorage.getItem("user");
        if (userData) {
          const currentUser = JSON.parse(userData);
          const updatedUser = { ...currentUser, balance: data.balance };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      setBalance(user.balance);
      fetchBalance();
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsProfileMenuOpen(false);
    window.location.reload();
  };

  return (
    <>
      {/* Top Header */}
      <header
        className={`fixed top-0 right-0 z-50 border-b border-border flex justify-center transition-all duration-300 ${
          isCollapsed ? "left-0 md:left-14" : "left-0 md:left-60"
        }`}
        style={{
          backgroundColor: THEME_CONFIG.header.background,
          height: `${THEME_CONFIG.header.height}px`,
        }}
      >
        <div className="flex items-center h-full px-4 w-full max-w-[1200px]">
          {/* Mobile: Sidebar trigger on left */}
          <div className="md:hidden mr-3">
            <SidebarTrigger />
          </div>

          {/* Desktop: Sidebar trigger fixed position */}
          <div className="hidden md:block fixed left-4 z-50">
            <SidebarTrigger />
          </div>

          {/* Logo - centered on mobile, left on desktop */}
          <div
            className="flex items-center cursor-pointer md:ml-0 flex-1 md:flex-none justify-center md:justify-start"
            onClick={() => navigate("/")}
          >
            <img
              src={THEME_CONFIG.header.logo.src}
              alt={THEME_CONFIG.brand.site_name}
              style={{
                height: `${THEME_CONFIG.header.logo.height_mobile}px`,
              }}
              className="md:hidden"
            />
            <img
              src={THEME_CONFIG.header.logo.src}
              alt={THEME_CONFIG.brand.site_name}
              style={{
                height: `${THEME_CONFIG.header.logo.height_desktop}px`,
              }}
              className="hidden md:block"
            />
          </div>

          {/* Auth buttons and flag - desktop only */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {user ? (
              <>
                {/* Deposit Button */}
                <button
                  onClick={() => setIsFundsOpen(true)}
                  className="px-6 py-2 rounded-md transition-all hover:opacity-90 text-sm font-medium flex items-center gap-2"
                  style={{
                    background: THEME_CONFIG.header.buttons.deposit.bg,
                    color: THEME_CONFIG.header.buttons.deposit.text,
                  }}
                >
                  <CreditCard className="w-4 h-4" />
                  Deposit
                </button>

                {/* Main Wallet */}
                <button
                  onClick={fetchBalance}
                  disabled={isRefreshing}
                  className="px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{
                    background: THEME_CONFIG.header.buttons.wallet.bg,
                    color: THEME_CONFIG.header.buttons.wallet.text,
                  }}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span
                    className="font-medium"
                    style={{
                      color: THEME_CONFIG.header.buttons.wallet.balance_color,
                    }}
                  >
                    Main Wallet
                  </span>
                  <span className="font-bold">৳{balance}</span>
                </button>

                {/* User Icon */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    <User className="w-6 h-6 text-white" />
                  </button>
                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileMenuOpen(false)}
                      />
                      <div
                        className="absolute right-0 mt-2 w-64 rounded-lg shadow-2xl z-50 overflow-hidden"
                        style={{
                          backgroundColor: THEME_CONFIG.header.profile_menu.bg,
                        }}
                      >
                        {/* VIP Points Section */}
                        <div className="p-4 border-b border-gray-700">
                          <p className="text-gray-400 text-sm mb-1">
                            VIP Points
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-red-500 text-2xl font-bold">
                              0
                            </span>
                            <RefreshCw className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {/* Deposit */}
                          <button
                            onClick={() => {
                              setIsFundsOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors"
                          >
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">
                              Deposit
                            </span>
                          </button>

                          {/* Withdrawal */}
                          <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors">
                            <Wallet className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">
                              Withdrawal
                            </span>
                          </button>

                          {/* Real-Time Bonus */}
                          <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors">
                            <Gift className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">
                              Real-Time Bonus
                            </span>
                          </button>

                          {/* Free Spin */}
                          <button
                            onClick={() => {
                              setIsFreeSpinOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors"
                          >
                            <Target className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">
                              Free Spin
                            </span>
                          </button>
                        </div>

                        <div className="border-t border-gray-700 py-2">
                          {/* Betting Records */}
                          <button
                            onClick={() => {
                              setIsBettingRecordsOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors"
                          >
                            <FileText className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">
                              Betting Records
                            </span>
                          </button>

                          {/* Turnover */}
                          <button
                            onClick={() => {
                              setIsTurnoverOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors"
                          >
                            <RefreshCw className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">
                              Turnover
                            </span>
                          </button>

                          {/* Transaction Records */}
                          <button
                            onClick={() => {
                              setIsTransactionRecordsOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors"
                          >
                            <Receipt className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">
                              Transaction Records
                            </span>
                          </button>
                        </div>

                        <div className="border-t border-gray-700 py-2">
                          {/* Personal Info */}
                          <button
                            onClick={() => {
                              setIsPersonalInfoOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors"
                          >
                            <UserCircle className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">
                              Personal Info
                            </span>
                          </button>

                          {/* Change Password */}
                          <button
                            onClick={() => {
                              setIsChangePasswordOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors"
                          >
                            <Lock className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">
                              Change Password
                            </span>
                          </button>

                          {/* Inbox */}
                          <button
                            onClick={() => {
                              setIsInboxOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors"
                          >
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div className="flex items-center justify-between flex-1">
                              <span className="text-white font-medium">
                                Inbox
                              </span>
                              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                0
                              </span>
                            </div>
                          </button>

                          {/* Logout */}
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors"
                          >
                            <LogOut className="w-5 h-5 text-gray-400" />
                            <span className="text-white font-medium">
                              Logout
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsSignUpModalOpen(true)}
                  className="px-6 py-1.5 rounded-md transition-colors text-xs font-medium"
                  style={{
                    background: THEME_CONFIG.header.buttons.signup.bg,
                    color: THEME_CONFIG.header.buttons.signup.text,
                  }}
                >
                  {t("signUp")}
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-8 py-1.5 rounded-md transition-colors text-xs font-medium"
                  style={{
                    background: THEME_CONFIG.header.buttons.login.bg,
                    color: THEME_CONFIG.header.buttons.login.text,
                  }}
                >
                  {t("login")}
                </button>
              </>
            )}
            <img
              src="/images/bdflag.png"
              alt="BD Flag"
              className="w-8 h-8 rounded-full object-cover ml-1 cursor-pointer hover:ring-2 hover:ring-white transition-all"
              onClick={() => setIsCurrencyModalOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ backgroundColor: THEME_CONFIG.mobile_bar.background }}
      >
        {user ? (
          <div
            className="grid grid-cols-3"
            style={{ height: `${THEME_CONFIG.mobile_bar.height}px` }}
          >
            {/* Deposit Button */}
            <button
              onClick={() => setIsFundsOpen(true)}
              className="flex flex-col items-center justify-center gap-1 border-r border-gray-700 hover:opacity-90 transition-opacity"
              style={{
                background: THEME_CONFIG.mobile_bar.buttons.deposit.bg,
                color: THEME_CONFIG.mobile_bar.buttons.deposit.text,
              }}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-medium">Deposit</span>
            </button>

            {/* Main Wallet */}
            <button
              onClick={fetchBalance}
              disabled={isRefreshing}
              className="flex flex-col items-center justify-center gap-1 border-r border-gray-700 hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{
                background: THEME_CONFIG.mobile_bar.buttons.wallet.bg,
                color: THEME_CONFIG.mobile_bar.buttons.wallet.text,
              }}
            >
              <div className="flex items-center gap-1">
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span
                  className="text-xs"
                  style={{
                    color: THEME_CONFIG.header.buttons.wallet.balance_color,
                  }}
                >
                  Main Wallet
                </span>
              </div>
              <span className="text-sm font-bold">৳{balance}</span>
            </button>

            {/* User Profile */}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center gap-1 hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: THEME_CONFIG.mobile_bar.buttons.profile.bg,
                color: THEME_CONFIG.mobile_bar.buttons.profile.text,
              }}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-3"
            style={{ height: `${THEME_CONFIG.mobile_bar.height}px` }}
          >
            {/* Currency/Language Box */}
            <button
              onClick={() => setIsCurrencyModalOpen(true)}
              className="flex flex-col items-center justify-center gap-1 border-r border-gray-700 hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: THEME_CONFIG.mobile_bar.buttons.profile.bg,
                color: THEME_CONFIG.mobile_bar.buttons.profile.text,
              }}
            >
              <img
                src="/images/bdflag.png"
                alt="BD Flag"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-xs font-medium">BDT বাংলা</span>
            </button>

            {/* Sign Up Box */}
            <button
              onClick={() => setIsSignUpModalOpen(true)}
              className="flex items-center justify-center border-r border-gray-700 hover:opacity-90 transition-opacity"
              style={{
                background: THEME_CONFIG.header.buttons.signup.bg,
                color: THEME_CONFIG.header.buttons.signup.text,
              }}
            >
              <span className="text-sm font-medium">{t("signUp")}</span>
            </button>

            {/* Login Box */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center justify-center hover:opacity-90 transition-opacity"
              style={{
                background: THEME_CONFIG.header.buttons.login.bg,
                color: THEME_CONFIG.header.buttons.login.text,
              }}
            >
              <span className="text-sm font-medium">{t("login")}</span>
            </button>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignUp={() => setIsSignUpModalOpen(true)}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => setIsLoginModalOpen(true)}
      />
      <CurrencyLanguageModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
      />
      {user && (
        <PersonalInfoModal
          isOpen={isPersonalInfoOpen}
          onClose={() => setIsPersonalInfoOpen(false)}
          user={user}
        />
      )}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
      <InboxModal isOpen={isInboxOpen} onClose={() => setIsInboxOpen(false)} />
      <FundsModal isOpen={isFundsOpen} onClose={() => setIsFundsOpen(false)} />
      <FreeSpinModal
        isOpen={isFreeSpinOpen}
        onClose={() => setIsFreeSpinOpen(false)}
      />
      <BettingRecordsModal
        isOpen={isBettingRecordsOpen}
        onClose={() => setIsBettingRecordsOpen(false)}
      />
      <TransactionRecordsModal
        isOpen={isTransactionRecordsOpen}
        onClose={() => setIsTransactionRecordsOpen(false)}
      />
      <TurnoverModal
        isOpen={isTurnoverOpen}
        onClose={() => setIsTurnoverOpen(false)}
      />
    </>
  );
}
