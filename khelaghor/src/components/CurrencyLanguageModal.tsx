import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CurrencyLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CurrencyLanguageModal({
  isOpen,
  onClose,
}: CurrencyLanguageModalProps) {
  const { language, setLanguage, t } = useLanguage();

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
        <div className="bg-gradient-to-br from-[#404040] to-[#262626] rounded-t-lg px-3 py-2 flex items-center justify-between">
          <h2 className="text-white text-sm font-semibold">
            {t("currencyAndLanguage")}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-black rounded-b-lg px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Currency/Flag */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-600">
                <img
                  src="/images/bdflag.png"
                  alt="Bangladesh Flag"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-white text-sm">৳</span>
                <span className="text-white text-sm font-semibold">BDT</span>
              </div>
            </div>

            {/* Language Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("bangla")}
                className={`px-3 py-1.5 text-xs font-medium transition-all rounded ${
                  language === "bangla"
                    ? "bg-transparent border border-white text-white"
                    : "bg-transparent border border-gray-600 text-gray-400 hover:border-gray-400"
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage("english")}
                className={`px-3 py-1.5 text-xs font-medium transition-all rounded ${
                  language === "english"
                    ? "bg-transparent border border-red-600 text-red-600"
                    : "bg-transparent border border-gray-600 text-gray-400 hover:border-gray-400"
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
