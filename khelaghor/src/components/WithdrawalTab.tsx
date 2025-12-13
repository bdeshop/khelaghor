import { useState, useEffect } from "react";

interface UserInputField {
  name: string;
  type: string;
  isRequired: boolean;
  label_en: string;
  label_bd: string;
  instruction_en: string;
  instruction_bd: string;
}

interface WithdrawMethod {
  _id: string;
  methodNameEn: string;
  methodNameBn: string;
  minimumWithdrawal: number;
  maximumWithdrawal: number;
  processingTime: string;
  status: string;
  withdrawalFee: number;
  feeType: string;
  methodImage: string;
  withdrawPageImage: string;
  instructionEn: string;
  instructionBn: string;
  colors: {
    textColor: string;
    backgroundColor: string;
    buttonColor: string;
  };
  userInputFields: UserInputField[];
  createdAt: string;
  updatedAt: string;
}

interface WithdrawMethodsResponse {
  success: boolean;
  count: number;
  withdrawMethods: WithdrawMethod[];
}

interface User {
  id: string;
  userName: string;
  myReferralCode: string;
  phone: number;
  callingCode: string;
  balance: number;
  role: string;
  fullName?: string;
}

export function WithdrawalTab() {
  const [withdrawMethods, setWithdrawMethods] = useState<WithdrawMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userInputData, setUserInputData] = useState<Record<string, string>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    const fetchWithdrawMethods = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/withdraw-methods/active"
        );
        const data: WithdrawMethodsResponse = await response.json();

        if (data.success) {
          setWithdrawMethods(data.withdrawMethods);
          if (data.withdrawMethods.length > 0) {
            setSelectedMethod(data.withdrawMethods[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching withdraw methods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawMethods();
  }, []);

  const handleSubmit = async () => {
    if (!selectedMethod || !withdrawAmount || !user?.fullName) {
      setError("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(withdrawAmount);

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amount < selectedMethod.minimumWithdrawal) {
      setError(
        `Minimum withdrawal amount is ৳${selectedMethod.minimumWithdrawal}`
      );
      return;
    }

    if (amount > selectedMethod.maximumWithdrawal) {
      setError(
        `Maximum withdrawal amount is ৳${selectedMethod.maximumWithdrawal}`
      );
      return;
    }

    if (amount > (user?.balance || 0)) {
      setError("Insufficient balance");
      return;
    }

    // Validate required user input fields
    for (const field of selectedMethod.userInputFields) {
      if (field.isRequired && !userInputData[field.name]?.trim()) {
        setError(`${field.label_en} is required`);
        return;
      }
    }

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:8000/api/withdraw-transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            withdrawMethodId: selectedMethod._id,
            amount: amount,
            userInputData: userInputData,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Success
        alert("Your withdrawal request has been submitted successfully!");
        // Reset form
        setWithdrawAmount("");
        setUserInputData({});
        setError("");
      } else {
        setError(data.message || "Failed to submit withdrawal request");
      }
    } catch (err) {
      console.error("Error submitting withdrawal:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-2 pb-3">
      {/* Main Wallet */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-red-600 rounded-full" />
          <h3 className="text-white text-sm font-medium">Main Wallet</h3>
        </div>
        <div className="bg-[#2a2a2a] rounded-lg px-3 py-3 flex items-center justify-between">
          <span className="text-gray-400 text-sm">Balance:</span>
          <span className="text-white text-lg font-bold">
            ৳{user?.balance || 0}
          </span>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="mb-3">
        <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <p className="text-white text-xs flex-1">
              Please complete the verification below before you proceed with the
              withdrawal request.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-red-600 rounded-full" />
          <h3 className="text-white text-sm font-medium">Personal Info</h3>
        </div>
        <div className="space-y-2">
          {/* Full Name */}
          <div className="bg-[#2a2a2a] rounded-lg px-3 py-2.5 flex items-center justify-between">
            {user?.fullName ? (
              <>
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 text-sm">Full Name</span>
                  <span className="text-white text-xs">{user.fullName}</span>
                </div>
                <span className="px-3 py-1 bg-green-700 text-white rounded text-xs font-medium">
                  Verified
                </span>
              </>
            ) : (
              <>
                <span className="text-gray-400 text-sm">Full Name</span>
                <button className="px-4 py-1 bg-gradient-to-b from-red-600 to-red-800 text-white rounded text-xs font-medium hover:opacity-90 transition-opacity">
                  Add
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-red-600 rounded-full" />
          <h3 className="text-white text-sm font-medium">Contact Info</h3>
        </div>
        <div className="space-y-2">
          {/* Phone Number */}
          <div className="bg-[#2a2a2a] rounded-lg px-3 py-2.5 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-gray-400 text-sm">Phone Number</span>
              <span className="text-white text-xs">
                +{user?.callingCode || "880"} {user?.phone || "N/A"}
              </span>
            </div>
            <span className="px-3 py-1 bg-green-700 text-white rounded text-xs font-medium">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Withdrawal Method */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-red-600 rounded-full" />
          <h3 className="text-white text-sm font-medium">Withdrawal Method</h3>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-4">Loading...</div>
        ) : withdrawMethods.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No withdrawal methods available
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {withdrawMethods.map((method) => (
                <button
                  key={method._id}
                  onClick={() => setSelectedMethod(method)}
                  className={`relative rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedMethod?._id === method._id
                      ? "border-2 border-red-600"
                      : "border-2 border-transparent hover:border-gray-600"
                  }`}
                  style={{ backgroundColor: method.colors.backgroundColor }}
                >
                  <img
                    src={`http://localhost:8000${method.methodImage}`}
                    alt={method.methodNameEn}
                    className="w-8 h-8 object-contain"
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: method.colors.textColor }}
                  >
                    {method.methodNameEn}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Method Info */}
            {selectedMethod && (
              <div className="bg-[#2a2a2a] rounded-lg p-3 space-y-2 mb-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Min Withdrawal:</span>
                  <span className="text-white font-medium">
                    ৳{selectedMethod.minimumWithdrawal}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Max Withdrawal:</span>
                  <span className="text-white font-medium">
                    ৳{selectedMethod.maximumWithdrawal}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Processing Time:</span>
                  <span className="text-white font-medium">
                    {selectedMethod.processingTime} hours
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Fee:</span>
                  <span className="text-white font-medium">
                    {selectedMethod.feeType === "Fixed"
                      ? `৳${selectedMethod.withdrawalFee}`
                      : `${selectedMethod.withdrawalFee}%`}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Amount Input */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-red-600 rounded-full" />
            <h3 className="text-white text-sm font-medium">Amount</h3>
          </div>
          {selectedMethod && (
            <span className="text-gray-500 text-xs">
              ৳{selectedMethod.minimumWithdrawal} - ৳
              {selectedMethod.maximumWithdrawal}
            </span>
          )}
        </div>
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Enter withdrawal amount"
          className="w-full bg-[#2a2a2a] border-2 border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
        />
      </div>

      {/* User Input Fields */}
      {selectedMethod && selectedMethod.userInputFields.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-red-600 rounded-full" />
            <h3 className="text-white text-sm font-medium">
              Additional Information
            </h3>
          </div>
          <div className="space-y-2">
            {selectedMethod.userInputFields.map((field) => (
              <div key={field.name}>
                <label className="block text-gray-400 text-xs mb-1">
                  {field.label_en}
                  {field.isRequired && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {field.instruction_en && (
                  <p className="text-xs text-gray-500 mb-1">
                    {field.instruction_en}
                  </p>
                )}
                <input
                  type={field.type}
                  placeholder={field.label_en}
                  value={userInputData[field.name] || ""}
                  onChange={(e) =>
                    setUserInputData((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  required={field.isRequired}
                  className="w-full bg-[#2a2a2a] border-2 border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-3 bg-red-950 border-l-4 border-red-500 p-3 rounded-r-lg">
          <p className="text-red-400 text-xs font-medium">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={
          !selectedMethod || !withdrawAmount || !user?.fullName || submitting
        }
        className="w-full bg-gradient-to-b from-red-600 to-red-800 text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit Withdrawal"}
      </button>
      {!user?.fullName && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Please add your full name to proceed with withdrawal
        </p>
      )}
    </div>
  );
}
