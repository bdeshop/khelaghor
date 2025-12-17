import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
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
  gateways: string[];
  method_image: string;
  payment_page_image: string;
  text_color: string;
  background_color: string;
  button_color: string;
  status: string;
  instruction_en: string;
  instruction_bd: string;
  user_input_fields: UserInputField[];
  createdAt: string;
  updatedAt: string;
}

interface DepositMethodsResponse {
  success: boolean;
  count: number;
  depositMethods: DepositMethod[];
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

interface DepositTabProps {
  onSubmit: (amount: number, method: DepositMethod) => void;
  selectedPromotion?: Promotion | null;
}

export function DepositTab({ onSubmit, selectedPromotion }: DepositTabProps) {
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(
    null
  );
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showPromotionDropdown, setShowPromotionDropdown] = useState(false);
  const [depositMethods, setDepositMethods] = useState<DepositMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepositMethods = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/deposit-methods/active`
        );
        const data: DepositMethodsResponse = await response.json();

        if (data.success) {
          setDepositMethods(data.depositMethods);
          if (data.depositMethods.length > 0) {
            setSelectedMethod(data.depositMethods[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching deposit methods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepositMethods();
  }, []);

  const amounts = [100, 500, 1000, 5000, 10000, 15000, 20000, 25000, 30000];

  // Calculate bonus amount
  const calculateBonus = (amount: number): number => {
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

  const currentAmount = selectedAmount || parseFloat(customAmount) || 0;
  const bonusAmount = calculateBonus(currentAmount);
  const totalAmount = currentAmount + bonusAmount;

  const handleSubmit = () => {
    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || !selectedMethod) {
      setError("Please select an amount and payment method");
      return;
    }

    // Validate minimum deposit if promotion is selected
    if (
      selectedPromotion &&
      selectedPromotion.bonusSettings.minDepositAmount > 0
    ) {
      if (amount < selectedPromotion.bonusSettings.minDepositAmount) {
        setError(
          `Minimum deposit for this promotion is ৳${selectedPromotion.bonusSettings.minDepositAmount}`
        );
        return;
      }
    }

    setError("");
    onSubmit(amount, selectedMethod);
  };

  return (
    <>
      {/* Payment Method */}
      <div className="px-2 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-red-600 rounded-full" />
          <h3 className="text-white text-sm font-medium">Payment Method</h3>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-4">Loading...</div>
        ) : depositMethods.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No payment methods available
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              {depositMethods.map((method) => (
                <button
                  key={method._id}
                  onClick={() => setSelectedMethod(method)}
                  className={`relative rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedMethod?._id === method._id
                      ? "border-2 border-red-600"
                      : "border-2 border-transparent hover:border-gray-600"
                  }`}
                  style={{ backgroundColor: method.background_color }}
                >
                  <img
                    src={`${API_BASE_URL}${method.method_image}`}
                    alt={method.method_name_en}
                    className="w-8 h-8 object-contain"
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: method.text_color }}
                  >
                    {method.method_name_en}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Payment Button */}
            {selectedMethod && (
              <button
                className="w-full border-2 border-red-600 rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: selectedMethod.button_color,
                  color: selectedMethod.text_color,
                }}
              >
                {selectedMethod.method_name_en} Payment
              </button>
            )}
          </>
        )}
      </div>

      {/* Promotion Info */}
      {selectedPromotion && (
        <div className="mx-2 mb-3 bg-red-950 border border-red-800 rounded-lg p-3">
          <h4 className="text-red-400 text-xs font-semibold mb-2">
            {selectedPromotion.title}
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>Bonus Type:</span>
              <span className="text-white font-medium capitalize">
                {selectedPromotion.bonusSettings.bonusType}
              </span>
            </div>
            {selectedPromotion.bonusSettings.bonusType === "fixed" ? (
              <div className="flex justify-between text-gray-300">
                <span>Bonus Amount:</span>
                <span className="text-red-400 font-bold">
                  ৳{selectedPromotion.bonusSettings.bonusAmount}
                </span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-gray-300">
                  <span>Bonus Percentage:</span>
                  <span className="text-red-400 font-bold">
                    {selectedPromotion.bonusSettings.bonusPercentage}%
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Max Bonus:</span>
                  <span className="text-red-400 font-bold">
                    ৳{selectedPromotion.bonusSettings.maxBonusAmount}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between text-gray-300 pt-1 border-t border-red-900">
              <span>Min Deposit:</span>
              <span className="text-white font-medium">
                ৳{selectedPromotion.bonusSettings.minDepositAmount}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Amount Section */}
      <div className="px-2 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-red-600 rounded-full" />
            <h3 className="text-white text-sm font-medium">Amount</h3>
          </div>
          <span className="text-gray-500 text-xs">
            {selectedPromotion &&
            selectedPromotion.bonusSettings.minDepositAmount > 0
              ? `Min: ৳${selectedPromotion.bonusSettings.minDepositAmount}`
              : "৳ 100.00 - ৳ 30,000.00"}
          </span>
        </div>

        {/* Amount Buttons */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {amounts.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setSelectedAmount(amount);
                setCustomAmount("");
              }}
              className={`bg-[#2a2a2a] rounded-lg py-2 text-sm font-medium transition-all ${
                selectedAmount === amount
                  ? "border-2 border-red-600 text-white"
                  : "border-2 border-transparent text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              {amount.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <input
          type="number"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedAmount(null);
          }}
          placeholder="Enter amount"
          className="w-full bg-[#2a2a2a] border-2 border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors mb-3"
        />

        {/* Bonus Calculation Display */}
        {selectedPromotion && currentAmount > 0 && (
          <div className="mb-3 bg-gray-900 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Deposit Amount:</span>
              <span className="text-white font-medium">৳{currentAmount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Bonus Amount:</span>
              <span className="text-green-500 font-medium">
                +৳{bonusAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-700 pt-2">
              <span className="text-white font-semibold">Total Amount:</span>
              <span className="text-red-500 font-bold text-lg">
                ৳{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-3 bg-red-950 border-l-4 border-red-500 p-2 rounded-r-lg">
            <p className="text-red-400 text-xs font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedMethod || (!selectedAmount && !customAmount)}
          className="w-full bg-gradient-to-b from-red-600 to-red-800 text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </>
  );
}
