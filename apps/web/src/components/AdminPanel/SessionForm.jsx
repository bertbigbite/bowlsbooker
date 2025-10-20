export function SessionForm({ session, onChange, onSubmit, onCancel, submitting, isEdit = false }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Session Name *
        </label>
        <input
          type="text"
          value={session.name}
          onChange={(e) => onChange({ ...session, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent"
          placeholder="e.g., Session 1 – 12:30–2:30"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            value={session.date}
            onChange={(e) => onChange({ ...session, date: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arrive By Time *
          </label>
          <input
            type="time"
            value={session.arriveByTime}
            onChange={(e) => onChange({ ...session, arriveByTime: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time *
          </label>
          <input
            type="time"
            value={session.startTime}
            onChange={(e) => onChange({ ...session, startTime: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time *
          </label>
          <input
            type="time"
            value={session.endTime}
            onChange={(e) => onChange({ ...session, endTime: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost Per Player (£)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={session.costPerPlayer}
            onChange={(e) => onChange({ ...session, costPerPlayer: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Players
          </label>
          <input
            type="number"
            min="1"
            value={session.maxPlayers}
            onChange={(e) => onChange({ ...session, maxPlayers: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instructions
        </label>
        <textarea
          value={session.instructions}
          onChange={(e) => onChange({ ...session, instructions: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent"
          rows="3"
          placeholder="Any special instructions for players..."
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-3 px-6 bg-[#56ccff] text-white rounded-lg font-semibold hover:bg-[#45b8e6] disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {submitting ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Session" : "Create Session")}
        </button>
      </div>
    </form>
  );
}
