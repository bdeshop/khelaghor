import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp?: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store all user data in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        onClose();
        window.location.reload(); // Reload to update header
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-[#404040] to-[#262626] rounded-t-lg px-6 py-4 flex items-center justify-center relative">
          <h2 className="text-white text-xl font-semibold">Login</h2>
          <button
            onClick={onClose}
            className="absolute right-6 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-black rounded-b-lg px-6 py-10 min-h-[600px]">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/images/smlogo.png" alt="Logo" className="h-16" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500 rounded-lg px-4 py-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Username Field */}
          <div className="mb-6">
            <label className="text-white text-sm font-medium mb-2 block">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="4-16 char, allow number"
              className="w-full bg-gray-800 border-2 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="text-white text-sm font-medium mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6-20 characters and numbers"
                className="w-full bg-gray-800 border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-6">
            <a
              href="#"
              className="text-red-600 text-sm hover:text-red-500 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-b from-[#404040] to-[#262626] text-white rounded-lg py-3 font-medium hover:from-[#4a4a4a] hover:to-[#2c2c2c] transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-gray-400 text-sm">
              Do not have an account?{" "}
            </span>
            <button
              onClick={() => {
                onClose();
                onSwitchToSignUp?.();
              }}
              className="text-red-600 text-sm font-medium hover:text-red-500 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
