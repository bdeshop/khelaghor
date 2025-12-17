import { X, Copy } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { API_BASE_URL } from "@/config/api";

interface UserInputField {
  name: string;
  type: string;
  isRequired: boolean;
  label_en: string;
  label_bd: string;
  instruction_en: string;
  instruction_bd: string;
}

interface DepositMethod {
  _id: string;
  method_name_en: string;
  method_name_bd: string;
  agent_wallet_number: string;
  agent_wallet_text: string;
  method_image: string;
  payment_page_image: string;
  text_color: string;
  background_color: string;
  button_color: string;
  instruction_en: string;
  instruction_bd: string;
  user_input_fields: UserInputField[];
}

interface BonusSettings {
  bonusPercentage: number;
  maxBonusAmount: number;
  bonusType: string;
  bonusAmount: number;
  minDepositAmount: number;
}

interface Promotion {
  _id: string;
  title: string;
  titleBn: string;
  bonusSettings: BonusSettings;
}

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  depositMethod: DepositMethod;
  selectedPromotion?: Promotion | null;
}

export function PaymentConfirmationModal({
  isOpen,
  onClose,
  amount,
  depositMethod,
  selectedPromotion,
}: PaymentConfirmationModalProps) {
  const { language } = useLanguage();
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);
  const [userInputData, setUserInputData] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate bonus amount
  const calculateBonus = (): number => {
    if (!selectedPromotion) return 0;

    const { bonusType, bonusAmount, bonusPercentage, maxBonusAmount } =
      selectedPromotion.bonusSettings;

    if (bonusType === "fixed") {
      return bonusAmount;
    } else {
      const calculatedBonus = (amount * bonusPercentage) / 100;
      return Math.min(calculatedBonus, maxBonusAmount);
    }
  };

  const bonusAmount = calculateBonus();
  const totalAmount = amount + bonusAmount;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(depositMethod.agent_wallet_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setUserInputData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      setError(
        language === "bangla"
          ? "লেনদেন আইডি প্রয়োজন"
          : "Transaction ID is required"
      );
      return;
    }

    // Validate required user input fields
    for (const field of depositMethod.user_input_fields) {
      if (field.isRequired && !userInputData[field.name]?.trim()) {
        setError(
          language === "bangla"
            ? `${field.label_bd} প্রয়োজন`
            : `${field.label_en} is required`
        );
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/deposit-transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          depositMethodId: depositMethod._id,
          transactionId: transactionId.trim(),
          amount: amount,
          userInputData: userInputData,
          promotionId: selectedPromotion?._id || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success - close modal and show success message
        alert(
          language === "bangla"
            ? "আপনার ডিপোজিট সফলভাবে জমা দেওয়া হয়েছে!"
            : "Your deposit has been submitted successfully!"
        );
        onClose();
      } else {
        setError(
          data.message ||
            (language === "bangla"
              ? "ডিপোজিট জমা দিতে ব্যর্থ হয়েছে"
              : "Failed to submit deposit")
        );
      }
    } catch (err) {
      console.error("Error submitting deposit:", err);
      setError(
        language === "bangla"
          ? "একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।"
          : "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="px-4 py-3 flex items-center justify-between relative bg-gradient-to-r from-red-600 to-red-500"
          style={{
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
        >
          <div>
            <h2 className="text-xl font-bold mb-0.5 text-white">
              BDT {amount.toLocaleString()}
            </h2>
            {selectedPromotion && bonusAmount > 0 && (
              <p className="text-xs text-green-400 font-semibold">
                +৳{bonusAmount.toFixed(2)} Bonus = ৳{totalAmount.toFixed(2)}{" "}
                Total
              </p>
            )}
            <p className="text-xs text-white/90">
              {language === "bangla"
                ? "কম বা বেশি ক্যাশআউট করবেন না"
                : "Do not cash out more or less"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white hover:bg-white/20 transition-all rounded-full p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-black p-3 rounded-b-lg">
          {/* Bonus Info */}
          {selectedPromotion && bonusAmount > 0 && (
            <div className="mb-3 bg-green-950 border-l-4 border-green-500 p-2 rounded-r-lg">
              <h4 className="text-green-400 font-semibold mb-1 text-xs">
                {selectedPromotion.title}
              </h4>
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between text-gray-300">
                  <span>Deposit Amount:</span>
                  <span className="text-white font-medium">
                    ৳{amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Bonus Amount:</span>
                  <span className="text-green-400 font-bold">
                    +৳{bonusAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs border-t border-green-900 pt-0.5 mt-0.5">
                  <span className="text-white font-semibold">
                    Total Amount:
                  </span>
                  <span className="text-green-400 font-bold">
                    ৳{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message */}

          <div className="space-y-3">
            {/* Agent Number */}
            <div className="bg-gray-900 rounded-lg p-2.5 border border-gray-800">
              <h3 className="text-red-500 font-semibold mb-1 text-xs">
                {language === "bangla" ? "ওয়ালেট নম্বর*" : "Wallet Number*"}
              </h3>
              <p className="text-[10px] text-gray-400 mb-2">
                {language === "bangla"
                  ? depositMethod.agent_wallet_text ||
                    "এই নাম্বারে শুধুমাত্র ক্যাশআউট গ্রহণ করা হয়"
                  : depositMethod.agent_wallet_text ||
                    "Only cash out is accepted at this number"}
              </p>
              <div className="relative">
                <input
                  type="text"
                  value={depositMethod.agent_wallet_number}
                  readOnly
                  className="w-full border border-gray-700 rounded px-3 py-2 text-sm font-bold text-white pr-10 bg-gray-800 focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors"
                  title="Copy"
                >
                  {copied ? (
                    <span className="text-green-500 text-xs font-semibold">
                      ✓
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-900 rounded-lg p-2.5 border border-gray-800">
              <h3 className="text-red-500 font-semibold mb-1 text-xs">
                {language === "bangla"
                  ? "ওয়ালেট প্রোভাইডার"
                  : "Wallet Provider"}
              </h3>
              <div className="bg-gray-800 rounded p-2 flex items-center gap-2 border border-gray-700">
                <img
                  src={`${API_BASE_URL}${
                    depositMethod.payment_page_image ||
                    depositMethod.method_image
                  }`}
                  alt={depositMethod.method_name_en}
                  className="w-8 h-8 object-contain"
                />
                <span className="text-sm font-bold text-white">
                  {language === "bangla"
                    ? depositMethod.method_name_bd
                    : depositMethod.method_name_en}
                </span>
              </div>
            </div>
          </div>

          {/* User Input Fields */}
          {depositMethod.user_input_fields.length > 0 && (
            <div className="mt-3">
              <h3 className="text-red-500 font-semibold mb-2 text-xs">
                {language === "bangla" ? "ইউজার ইনপুট" : "User Input"}
              </h3>
              <div className="space-y-2">
                {depositMethod.user_input_fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-red-500 font-semibold mb-1 text-xs">
                      {language === "bangla" ? field.label_bd : field.label_en}
                      {field.isRequired && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {field.instruction_en && (
                      <p className="text-[10px] text-gray-400 mb-1">
                        {language === "bangla"
                          ? field.instruction_bd
                          : field.instruction_en}
                      </p>
                    )}
                    <input
                      type={field.type}
                      placeholder={
                        language === "bangla" ? field.label_bd : field.label_en
                      }
                      value={userInputData[field.name] || ""}
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.value)
                      }
                      required={field.isRequired}
                      className="w-full border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 bg-gray-800 focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transaction ID Input */}
          <div className="mt-3">
            <label className="block text-red-500 font-semibold mb-1 text-xs">
              {language === "bangla" ? "লেনদেন আইডি" : "Transaction ID"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-[10px] text-gray-400 mb-1">
              {language === "bangla"
                ? "আপনার লেনদেন আইডি লিখুন"
                : "Enter your transaction ID"}
            </p>
            <input
              type="text"
              placeholder={
                language === "bangla"
                  ? "লেনদেন আইডি লিখুন"
                  : "Enter transaction ID"
              }
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="w-full border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 bg-gray-800 focus:outline-none focus:border-red-500 transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-2 bg-red-950 border-l-4 border-red-500 p-2 rounded-r-lg">
              <p className="text-red-400 text-xs font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? language === "bangla"
                  ? "জমা দেওয়া হচ্ছে..."
                  : "Submitting..."
                : language === "bangla"
                ? "নিশ্চিত করুন"
                : "Confirm Payment"}
            </button>
          </div>

          {/* Instructions */}
        </div>
      </div>
    </div>
  );
}
