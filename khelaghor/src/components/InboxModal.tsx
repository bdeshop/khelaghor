import { X, Calendar, MoreVertical, Bell } from "lucide-react";

interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InboxModal({ isOpen, onClose }: InboxModalProps) {
  if (!isOpen) return null;

  // Sample messages - you can replace with real data
  const messages = [
    {
      id: 1,
      title: "Sign up success.",
      message: "Congratulations sign up success.",
      date: "2025/12/02",
      time: "21:51:51",
      timezone: "GMT+6",
      read: false,
    },
  ];

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
        <div className="bg-gradient-to-br from-[#404040] to-[#262626] rounded-t-lg px-4 py-3 flex items-center justify-center relative">
          <h2 className="text-white text-lg font-semibold">Inbox</h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-black rounded-b-lg flex-1 overflow-y-auto">
          {/* Header with date and menu */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">2025/12/02</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 border border-gray-700 px-2 py-0.5 rounded">
                GMT+6
              </span>
              <button className="text-gray-400 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="px-4 py-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex gap-3 py-3 border-b border-gray-800 last:border-b-0"
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-white font-medium text-sm">
                      {message.title}
                    </h3>
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      {message.time}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* End of Page */}
          <div className="text-center py-6">
            <span className="text-gray-600 text-sm">- end of page -</span>
          </div>
        </div>
      </div>
    </div>
  );
}
