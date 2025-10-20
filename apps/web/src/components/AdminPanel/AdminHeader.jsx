import { Plus } from "lucide-react";

export function AdminHeader({ onCreateSession, onQuickCreateThursday }) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage bowling sessions and bookings
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onQuickCreateThursday}
              className="bg-[#fde93f] text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
            >
              Quick: Thursday Sessions
            </button>
            <button
              onClick={onCreateSession}
              className="bg-[#56ccff] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#45b8e6] transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Session</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
