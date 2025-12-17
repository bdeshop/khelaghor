import { X, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReferralDashboard {
  myReferralCode: string;
  referralCount: number;
  todayRewards: number;
  yesterdayRewards: number;
  availableCashRewards: number;
  balance: number;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [activeTab, setActiveTab] = useState<"invite" | "details">("invite");
  const [dashboardData, setDashboardData] = useState<ReferralDashboard | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDashboard();
    }
  }, [isOpen]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/referrals/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error("Error fetching referral dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (dashboardData?.myReferralCode) {
      navigator.clipboard.writeText(dashboardData.myReferralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClaimRewards = async () => {
    if (!dashboardData || dashboardData.availableCashRewards <= 0) return;

    setClaiming(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_BASE_URL}/api/referrals/claim-rewards`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(
          `Successfully claimed ৳${result.data.claimedAmount}! New balance: ৳${result.data.newBalance}`
        );
        // Refresh dashboard data
        fetchDashboard();
      } else {
        alert(result.message || "Failed to claim rewards");
      }
    } catch (error) {
      console.error("Error claiming rewards:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-[#404040] to-[#262626] rounded-t-lg px-4 py-3 flex items-center justify-center">
          <h2 className="text-white text-lg font-semibold">Referral</h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-black flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab("invite")}
            className={`flex-1 py-2 text-xs font-medium transition-colors relative ${
              activeTab === "invite"
                ? "text-red-600"
                : "text-white hover:text-gray-300"
            }`}
          >
            Invite
            {activeTab === "invite" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-2 text-xs font-medium transition-colors relative ${
              activeTab === "details"
                ? "text-red-600"
                : "text-white hover:text-gray-300"
            }`}
          >
            Details
            {activeTab === "details" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-black rounded-b-lg px-4 py-4">
          {activeTab === "invite" && (
            <div className="space-y-4">
              {/* Refer Your Friends Section */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-0.5 h-4 bg-red-600 rounded-full" />
                  <h3 className="text-white text-sm font-medium">
                    Refer Your Friends and Earn
                  </h3>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="/images/referral-invite-banner-bdt-en.png"
                    alt="Refer a Friend"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* QR Code and Invitation Link */}
              <div className="grid grid-cols-2 gap-3">
                {/* QR Code */}
                <div>
                  <h4 className="text-gray-400 text-xs mb-2">
                    Invitation QR Code
                  </h4>
                  <div className="bg-white p-1.5 rounded-lg w-24 mx-auto">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${
                        dashboardData?.myReferralCode || ""
                      }`}
                      alt="QR Code"
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Invitation Link & Code */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-gray-400 text-xs mb-2">
                      Invitation Link
                    </h4>
                    <button className="w-full bg-gradient-to-b from-red-700 to-red-900 text-white rounded-lg py-2 text-xs font-medium hover:from-red-600 hover:to-red-800 transition-all">
                      Share
                    </button>
                  </div>

                  <div>
                    <h4 className="text-gray-400 text-xs mb-2">
                      Invitation Code
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 bg-gray-800 rounded-lg px-3 py-2">
                        <span className="text-white text-xs font-medium">
                          {loading
                            ? "..."
                            : dashboardData?.myReferralCode || "N/A"}
                        </span>
                      </div>
                      <button
                        onClick={handleCopyCode}
                        className="bg-gradient-to-b from-red-700 to-red-900 text-white rounded-lg p-2 hover:from-red-600 hover:to-red-800 transition-all"
                      >
                        {copied ? (
                          <span className="text-green-400 text-xs font-bold">
                            ✓
                          </span>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 bg-gray-900 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-red-600 text-[10px] mb-0.5">
                    Referral Count
                  </p>
                  <p className="text-white text-lg font-bold">
                    {loading ? "..." : dashboardData?.referralCount || 0}
                  </p>
                </div>
                <div className="text-center border-l border-r border-gray-700">
                  <p className="text-red-600 text-[10px] mb-0.5">
                    Today's Rewards
                  </p>
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-white text-lg font-bold">৳</span>
                    <span className="text-white text-lg font-bold">
                      {loading ? "..." : dashboardData?.todayRewards || 0}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-red-600 text-[10px] mb-0.5">
                    Yesterday's Rewards
                  </p>
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-white text-lg font-bold">৳</span>
                    <span className="text-white text-lg font-bold">
                      {loading ? "..." : dashboardData?.yesterdayRewards || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Available Cash Rewards */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-0.5 h-4 bg-red-600 rounded-full" />
                  <h3 className="text-white text-sm font-medium">
                    Available Cash Rewards
                  </h3>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-red-600 text-2xl font-bold">৳</span>
                    <span className="text-red-600 text-2xl font-bold">
                      {loading
                        ? "..."
                        : dashboardData?.availableCashRewards || 0}
                    </span>
                  </div>
                  <button
                    onClick={handleClaimRewards}
                    disabled={
                      claiming ||
                      loading ||
                      !dashboardData ||
                      dashboardData.availableCashRewards <= 0
                    }
                    className="bg-gradient-to-b from-gray-700 to-gray-900 text-white rounded-lg px-6 py-2 text-sm font-medium hover:from-gray-600 hover:to-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {claiming ? "Claiming..." : "Claim"}
                  </button>
                </div>
              </div>

              {/* How to earn more rewards */}
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-0.5 h-4 bg-red-600 rounded-full" />
                  <h3 className="text-white text-sm font-medium">
                    How to earn more rewards
                  </h3>
                </div>

                <div className="border-t border-gray-700 pt-3 mb-3">
                  <p className="text-gray-300 text-xs leading-relaxed">
                    All referrer will receive certain cash reward percentage for
                    every referee when they play games on Khelaghor.
                  </p>
                </div>

                {/* Referral Tree Diagram */}
                <div className="border-t border-gray-700 pt-3 mb-3">
                  <img
                    src="/images/commission-from.png"
                    alt="Referral Tree"
                    className="w-full h-32 object-contain bg-gray-800 rounded"
                  />
                </div>

                <div className="border-t border-gray-700 pt-3 mb-2">
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Be diligent in referring, be the upline and earn up to 3
                    tiers easily!
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-red-600 text-sm font-bold">
                    Welcome to lifetime commissions!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-3 text-white">
              <h3 className="text-sm font-semibold mb-3">Referral Details</h3>
              <div className="space-y-2 text-xs text-gray-300">
                <p>
                  • Invite your friends and earn rewards when they sign up and
                  play.
                </p>
                <p>
                  • Share your unique referral code or QR code with friends.
                </p>
                <p>• Track your referral count and rewards in real-time.</p>
                <p>
                  • Claim your accumulated rewards anytime from the Available
                  Cash Rewards section.
                </p>
                <p className="text-red-600 font-medium mt-3 text-xs">
                  Start referring now and maximize your earnings!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
