import {
  X,
  ChevronRight,
  User,
  Cake,
  Phone,
  Mail,
  Headphones,
} from "lucide-react";
import { useState } from "react";
import { API_BASE_URL } from "@/constants/api";

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    userName: string;
    phone: number;
    callingCode: string;
    myReferralCode: string;
    fullName?: string;
    birthday?: string;
    email?: string;
  };
}

export function PersonalInfoModal({
  isOpen,
  onClose,
  user,
}: PersonalInfoModalProps) {
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [isEditingBirthday, setIsEditingBirthday] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [fullName, setFullName] = useState(user.fullName || "");
  const [birthday, setBirthday] = useState(user.birthday || "");
  const [email, setEmail] = useState(user.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleUpdateProfile = async (field: string, value: string) => {
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_BASE_URL}/api/frontend/auth/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: field === "fullName" ? value : fullName,
            birthday: field === "birthday" ? value : birthday,
            phone: user.phone,
            email: field === "email" ? value : email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new user data
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...storedUser,
          fullName: field === "fullName" ? value : fullName,
          birthday: field === "birthday" ? value : birthday,
          email: field === "email" ? value : email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        alert("Profile updated successfully!");
        setIsEditingFullName(false);
        setIsEditingBirthday(false);
        setIsEditingEmail(false);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-[#404040] to-[#262626] rounded-t-lg px-4 py-3 flex items-center justify-center relative">
          <h2 className="text-white text-lg font-semibold">Personal Info</h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-black rounded-b-lg">
          {/* Profile Banner */}
          <div className="relative">
            {/* Background Image */}
            <div className="h-28 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-700 relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-2 left-6 w-10 h-10 rounded-full bg-white/20" />
                <div className="absolute top-4 right-8 w-8 h-8 rounded-full bg-white/20" />
                <div className="absolute bottom-3 left-12 w-6 h-6 rounded-full bg-white/20" />
                <div className="absolute bottom-4 right-14 w-9 h-9 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Profile Picture */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-black">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-14 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-white text-lg font-semibold">
                {user.userName}
              </h3>
              <span className="px-2 py-0.5 bg-gray-600 text-white text-xs rounded-full">
                Normal
              </span>
            </div>
            <p className="text-gray-400 text-xs">
              Date Registered : {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>

          {/* VIP Points Section */}
          <div className="mx-3 mb-3">
            <div className="bg-[#2a2a2a] rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium">
                  VIP Points (VP)
                </span>
                <span className="text-red-500 text-xl font-bold">0</span>
              </div>
              <button className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors">
                <span className="text-xs">My VIP</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="mx-3 mb-3">
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <p className="text-white text-xs flex-1">
                  Please complete the verification below before you proceed with
                  the withdrawal request.
                </p>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-3 mb-3 bg-red-500/20 border border-red-500 rounded-lg px-3 py-2 text-red-500 text-xs">
              {error}
            </div>
          )}

          {/* Personal Details */}
          <div className="px-3 pb-4 space-y-3">
            {/* Full Name */}
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center gap-2 flex-1">
                <User className="w-4 h-4 text-red-500" />
                {isEditingFullName ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                ) : (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white text-sm font-medium">
                      Full Name
                    </span>
                    {fullName && (
                      <span className="text-gray-400 text-xs">{fullName}</span>
                    )}
                  </div>
                )}
              </div>
              {isEditingFullName ? (
                <button
                  onClick={() => handleUpdateProfile("fullName", fullName)}
                  disabled={isLoading || !fullName}
                  className="px-6 py-1.5 bg-gradient-to-b from-green-600 to-green-800 text-white rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingFullName(true)}
                  className="px-8 py-1.5 bg-gradient-to-b from-red-600 to-red-800 text-white rounded text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {fullName ? "Edit" : "Add"}
                </button>
              )}
            </div>

            {/* Birthday */}
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center gap-2 flex-1">
                <Cake className="w-4 h-4 text-red-500" />
                {isEditingBirthday ? (
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                ) : (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white text-sm font-medium">
                      Birthday
                    </span>
                    {birthday && (
                      <span className="text-gray-400 text-xs">{birthday}</span>
                    )}
                  </div>
                )}
              </div>
              {isEditingBirthday ? (
                <button
                  onClick={() => handleUpdateProfile("birthday", birthday)}
                  disabled={isLoading || !birthday}
                  className="px-6 py-1.5 bg-gradient-to-b from-green-600 to-green-800 text-white rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingBirthday(true)}
                  className="px-8 py-1.5 bg-gradient-to-b from-red-600 to-red-800 text-white rounded text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {birthday ? "Edit" : "Add"}
                </button>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500" />
                  <span className="text-white text-sm font-medium">
                    Phone Number
                  </span>
                </div>
                <span className="text-gray-400 text-xs ml-6">
                  +{user.callingCode} {user.phone}
                </span>
              </div>
              <span className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded text-xs font-medium">
                Not Verified
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center gap-2 flex-1">
                <Mail className="w-4 h-4 text-red-500" />
                {isEditingEmail ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                ) : (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white text-sm font-medium">
                      Email
                    </span>
                    {email && (
                      <span className="text-gray-400 text-xs">{email}</span>
                    )}
                  </div>
                )}
              </div>
              {isEditingEmail ? (
                <button
                  onClick={() => handleUpdateProfile("email", email)}
                  disabled={isLoading || !email}
                  className="px-6 py-1.5 bg-gradient-to-b from-green-600 to-green-800 text-white rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="px-8 py-1.5 bg-gradient-to-b from-red-600 to-red-800 text-white rounded text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {email ? "Edit" : "Add"}
                </button>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start gap-2 pt-2 pb-2">
              <Headphones className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-400 text-xs leading-relaxed">
                For privacy and security, information can't modified after
                confirmation. Please{" "}
                <span className="text-red-500 font-medium">
                  contact customer service
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
