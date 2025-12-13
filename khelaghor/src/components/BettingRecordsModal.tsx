import { X, Filter, Clipboard } from "lucide-react";
import { useState } from "react";

interface BettingRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BettingRecordsModal({
  isOpen,
  onClose,
}: BettingRecordsModalProps) {
  const [activeTab, setActiveTab] = useState<"settled" | "unsettled">(
    "settled"
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-[#404040] to-[#262626] rounded-t-lg px-3 py-2 flex items-center justify-center relative">
          <h2 className="text-white text-sm font-semibold">Betting Records</h2>
          <button
            onClick={onClose}
            className="absolute right-3 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-black rounded-b-lg flex-1 flex flex-col">
          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-gray-800">
            <button
              onClick={() => setActiveTab("settled")}
              className={`py-2.5 text-xs font-medium transition-all relative ${
                activeTab === "settled"
                  ? "text-red-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Settled
              {activeTab === "settled" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("unsettled")}
              className={`py-2.5 text-xs font-medium transition-all relative ${
                activeTab === "unsettled"
                  ? "text-red-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Unsettled
              {activeTab === "unsettled" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
              )}
            </button>
          </div>

          {/* Filter Section */}
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-800">
            <div className="bg-red-600 px-2 py-0.5 rounded text-white text-[10px] font-medium">
              Last 7 days
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-4 bg-[#4a0000] border-b border-gray-800">
            <div className="px-1 py-1.5 text-center">
              <span className="text-white text-[10px] font-medium">
                Platform
              </span>
            </div>
            <div className="px-1 py-1.5 text-center border-l border-gray-800">
              <span className="text-white text-[10px] font-medium">
                Game Type
              </span>
            </div>
            <div className="px-1 py-1.5 text-center border-l border-gray-800">
              <span className="text-white text-[10px] font-medium">
                Turnover
              </span>
            </div>
            <div className="px-1 py-1.5 text-center border-l border-gray-800">
              <span className="text-white text-[10px] font-medium">
                Profit/Loss
              </span>
            </div>
          </div>

          {/* Content Area - No Data */}
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            {/* No Data Icon */}
            <div className="mb-3">
              <Clipboard
                className="w-16 h-16 text-gray-600"
                strokeWidth={1.5}
              />
            </div>

            {/* No Data Text */}
            <p className="text-gray-500 text-xs">No Data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
