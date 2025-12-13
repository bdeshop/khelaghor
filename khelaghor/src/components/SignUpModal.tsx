import { X, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export function SignUpModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: SignUpModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [captcha] = useState("2062");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const passwordValidations = [
    {
      text: "Between 6~20 characters",
      valid: password.length >= 6 && password.length <= 20,
    },
    { text: "At least one alphabet.", valid: /[a-zA-Z]/.test(password) },
    {
      text: "At least one number. (Special character, symbols are allowed)",
      valid: /[0-9]/.test(password),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          password: password,
          friendReferrerCode: "",
          phone: parseInt(phoneNumber),
          callingCode: "880",
          captcha: verificationCode,
          balance: 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please log in.");
        onClose();
        onSwitchToLogin?.();
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-[#404040] to-[#262626] rounded-t-lg px-6 py-4 flex items-center justify-center sticky top-0 z-10">
          <h2 className="text-white text-xl font-semibold">Sign up</h2>
          <button
            onClick={onClose}
            className="absolute right-6 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-black rounded-b-lg px-6 py-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500 rounded-lg px-4 py-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Username Field */}
          <div className="mb-5">
            <label className="text-white text-sm font-medium mb-2 block">
              Username
            </label>
            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg px-4 py-3 focus-within:border-red-500 transition-colors">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="4-16 char, allow number"
                className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none [&:-webkit-autofill]:!bg-transparent [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgb(31,41,55)]"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="text-white text-sm font-medium mb-2 block">
              Password
            </label>
            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg px-4 py-3 focus-within:border-red-500 transition-colors flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6-20 characters and numbers"
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none [&:-webkit-autofill]:!bg-transparent [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgb(31,41,55)]"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white transition-colors ml-2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Validations */}
          <div className="mb-5 space-y-2">
            {passwordValidations.map((validation, index) => (
              <div key={index} className="flex items-start gap-2">
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                    validation.valid ? "bg-green-600" : "bg-gray-600"
                  }`}
                >
                  {validation.valid && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-gray-400 text-sm">{validation.text}</span>
              </div>
            ))}
          </div>

          {/* Phone Number Field */}
          <div className="mb-5">
            <label className="text-white text-sm font-medium mb-2 block">
              Phone Number
            </label>
            <div className="flex items-center gap-2 bg-gray-800 border-2 border-gray-600 rounded-lg px-4 py-3 focus-within:border-red-500 transition-colors">
              <div className="flex items-center gap-2 border-r border-gray-600 pr-3">
                <div className="w-2 h-2 rounded-full  flex items-center justify-center">
                  <span className="text-white text-xs">🇧🇩</span>
                </div>
                <span className="text-red-600 font-medium">+880</span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Verification Code Field */}
          <div className="mb-6">
            <label className="text-white text-sm font-medium mb-2 block">
              Verification Code
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 4 digit code"
                className="flex-1 bg-gray-800 border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3">
                <span className="text-black font-bold text-lg tracking-wider">
                  {captcha}
                </span>
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-b from-[#404040] to-[#262626] text-white rounded-lg py-3 font-medium hover:from-[#4a4a4a] hover:to-[#2c2c2c] transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>

          {/* Log In Link */}
          <div className="text-center mb-4">
            <span className="text-gray-400 text-sm">Already a member? </span>
            <button
              onClick={() => {
                onClose();
                onSwitchToLogin?.();
              }}
              className="text-red-600 text-sm font-medium hover:text-red-500 transition-colors"
            >
              Log in
            </button>
          </div>

          {/* Terms & Conditions */}
          <div className="text-center text-sm text-gray-400">
            I certify that I am at least 18 years old and that I agree to the{" "}
            <a
              href="#"
              className="text-red-600 hover:text-red-500 transition-colors"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
