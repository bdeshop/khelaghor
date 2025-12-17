import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { API_BASE_URL } from "@/config/api";

interface BonusSettings {
  bonusPercentage: number;
  maxBonusAmount: number;
  bonusType: string;
  bonusAmount: number;
  minDepositAmount: number;
}

interface GameType {
  _id: string;
  name: string;
}

interface PaymentMethod {
  _id: string;
  method_name_en: string;
  method_name_bd: string;
  method_image: string;
}

interface Promotion {
  _id: string;
  promotionImage: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  gameType: GameType;
  paymentMethods: PaymentMethod[];
  bonusSettings: BonusSettings;
  createdAt: string;
  updatedAt: string;
}

interface PromotionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: Promotion | null;
}

export function PromotionDetailsModal({
  isOpen,
  onClose,
  promotion,
}: PromotionDetailsModalProps) {
  const { language } = useLanguage();

  if (!isOpen || !promotion) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 py-3 flex items-center justify-between relative bg-gradient-to-r from-red-600 to-red-500 rounded-t-xl">
          <h2 className="text-lg font-bold text-white">
            {language === "bangla" ? "প্রচার বিবরণ" : "Promotion Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white hover:bg-white/20 transition-all rounded-full p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-black p-4 rounded-b-xl">
          {/* Promotion Image */}
          <div className="mb-4">
            <img
              src={`${API_BASE_URL}${promotion.promotionImage}`}
              alt={language === "bangla" ? promotion.titleBn : promotion.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* Title */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white mb-1">
              {language === "bangla" ? promotion.titleBn : promotion.title}
            </h3>
            <p className="text-xs text-gray-400">
              {language === "bangla" ? "গেম টাইপ:" : "Game Type:"}{" "}
              <span className="font-semibold text-gray-300">
                {promotion.gameType.name}
              </span>
            </p>
          </div>

          {/* Description */}
          <div className="mb-4 bg-gray-900 rounded-lg p-3 border border-gray-800">
            <h4 className="text-sm font-semibold text-white mb-1.5">
              {language === "bangla" ? "বিবরণ" : "Description"}
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              {language === "bangla"
                ? promotion.descriptionBn
                : promotion.description}
            </p>
          </div>

          {/* Bonus Settings */}
          <div className="mb-4 bg-red-950 rounded-lg p-3 border-2 border-red-800">
            <h4 className="text-sm font-semibold text-red-400 mb-2">
              {language === "bangla" ? "বোনাস সেটিংস" : "Bonus Settings"}
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">
                  {language === "bangla" ? "বোনাস টাইপ:" : "Bonus Type:"}
                </span>
                <span className="text-xs font-semibold text-white capitalize">
                  {promotion.bonusSettings.bonusType}
                </span>
              </div>

              {promotion.bonusSettings.bonusType === "fixed" ? (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">
                    {language === "bangla" ? "বোনাস পরিমাণ:" : "Bonus Amount:"}
                  </span>
                  <span className="font-bold text-red-500 text-sm">
                    ৳{promotion.bonusSettings.bonusAmount}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300">
                      {language === "bangla"
                        ? "বোনাস শতাংশ:"
                        : "Bonus Percentage:"}
                    </span>
                    <span className="font-bold text-red-500 text-sm">
                      {promotion.bonusSettings.bonusPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300">
                      {language === "bangla"
                        ? "সর্বোচ্চ বোনাস:"
                        : "Max Bonus Amount:"}
                    </span>
                    <span className="font-bold text-red-500 text-sm">
                      ৳{promotion.bonusSettings.maxBonusAmount}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center pt-1.5 border-t border-red-900">
                <span className="text-xs text-gray-300">
                  {language === "bangla"
                    ? "ন্যূনতম ডিপোজিট:"
                    : "Min Deposit Amount:"}
                </span>
                <span className="text-xs font-semibold text-white">
                  ৳{promotion.bonusSettings.minDepositAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2">
              {language === "bangla" ? "পেমেন্ট পদ্ধতি" : "Payment Methods"}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {promotion.paymentMethods.map((method) => (
                <div
                  key={method._id}
                  className="bg-gray-900 rounded-lg p-2 border border-gray-800 flex items-center gap-2"
                >
                  <img
                    src={`${API_BASE_URL}${method.method_image}`}
                    alt={method.method_name_en}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-xs font-medium text-gray-300">
                    {language === "bangla"
                      ? method.method_name_bd
                      : method.method_name_en}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="mb-4 text-xs text-gray-400 space-y-0.5">
            <p>
              {language === "bangla" ? "তৈরি হয়েছে:" : "Created:"}{" "}
              {new Date(promotion.createdAt).toLocaleString()}
            </p>
            <p>
              {language === "bangla" ? "আপডেট হয়েছে:" : "Updated:"}{" "}
              {new Date(promotion.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 text-sm font-bold rounded-lg transition-all"
          >
            {language === "bangla" ? "বন্ধ করুন" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
