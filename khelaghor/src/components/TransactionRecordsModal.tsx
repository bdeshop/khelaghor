import { X, Filter, Clipboard } from "lucide-react";

interface TransactionRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionRecordsModal({
  isOpen,
  onClose,
}: TransactionRecordsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative w-[400px] h-[700px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-[#404040] to-[#262626] rounded-t-lg px-3 py-2 flex items-center justify-center relative">
          <h2 className="text-white text-sm font-semibold">
            Transaction Records
          </h2>
          <button
            onClick={onClose}
            className="absolute right-3 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-black flex-1 flex flex-col">
          {/* Filter Section */}
          <div className="flex items-center justify-between px-3 py-3 bg-black">
            <div className="bg-red-600 px-3 py-1.5 rounded text-white text-xs font-medium">
              Today
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-4 bg-gradient-to-b from-[#5a0000] to-[#3a0000]">
            <div className="px-2 py-3 text-center border-r border-gray-700">
              <span className="text-white text-sm font-medium">Type</span>
            </div>
            <div className="px-2 py-3 text-center border-r border-gray-700">
              <span className="text-white text-sm font-medium">Amount</span>
            </div>
            <div className="px-2 py-3 text-center border-r border-gray-700">
              <span className="text-white text-sm font-medium">Status</span>
            </div>
            <div className="px-2 py-3 text-center">
              <span className="text-white text-sm font-medium">Txn Date</span>
            </div>
          </div>

          {/* Content Area - No Data */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black">
            {/* No Data Icon */}
            <div className="mb-4">
              <Clipboard
                className="w-24 h-24 text-gray-600"
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
