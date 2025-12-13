import { X, Clipboard } from "lucide-react";
import { useState } from "react";

interface TurnoverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TurnoverModal({ isOpen, onClose }: TurnoverModalProps) {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-[#404040] to-[#262626] rounded-t-lg px-3 py-2.5 flex items-center justify-center relative">
          <h2 className="text-white text-base font-semibold">Turnover</h2>
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
              onClick={() => setActiveTab("active")}
              className={`py-3 text-sm font-medium transition-all relative ${
                activeTab === "active"
                  ? "text-red-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Active
              {activeTab === "active" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`py-3 text-sm font-medium transition-all relative ${
                activeTab === "completed"
                  ? "text-red-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Completed
              {activeTab === "completed" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
              )}
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            {/* No Data Icon */}
            <div className="mb-4">
              <Clipboard
                className="w-20 h-20 text-gray-600"
                strokeWidth={1.5}
              />
            </div>

            {/* No Data Text */}
            <p className="text-gray-500 text-sm">No Data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
