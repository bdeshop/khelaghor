import { X } from "lucide-react";
import { useState } from "react";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";
import { DepositTab } from "./DepositTab";
import { WithdrawalTab } from "./WithdrawalTab";

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

interface FundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPromotion?: Promotion | null;
}

export function FundsModal({
  isOpen,
  onClose,
  selectedPromotion,
}: FundsModalProps) {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdrawal">(
    "deposit"
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositMethod, setDepositMethod] = useState<DepositMethod | null>(
    null
  );

  if (!isOpen) return null;

  const handleDepositSubmit = (amount: number, method: DepositMethod) => {
    setDepositAmount(amount);
    setDepositMethod(method);
    setShowConfirmation(true);
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
        <div className="bg-gradient-to-br from-[#404040] to-[#262626] rounded-t-lg px-3 py-2.5 flex items-center justify-center relative">
          <h2 className="text-white text-base font-semibold">Funds</h2>
          <button
            onClick={onClose}
            className="absolute right-3 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-[#1a1a1a] rounded-b-lg">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 p-2">
            <button
              onClick={() => setActiveTab("deposit")}
              className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "deposit"
                  ? "bg-gradient-to-b from-red-600 to-red-800 text-white"
                  : "bg-[#2a2a2a] text-gray-400 hover:text-white"
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setActiveTab("withdrawal")}
              className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "withdrawal"
                  ? "bg-gradient-to-b from-red-600 to-red-800 text-white"
                  : "bg-[#2a2a2a] text-gray-400 hover:text-white"
              }`}
            >
              Withdrawal
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "deposit" && (
            <DepositTab
              onSubmit={handleDepositSubmit}
              selectedPromotion={selectedPromotion}
            />
          )}

          {activeTab === "withdrawal" && <WithdrawalTab />}
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {depositMethod && (
        <PaymentConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          amount={depositAmount}
          depositMethod={depositMethod}
          selectedPromotion={selectedPromotion}
        />
      )}
    </div>
  );
}
