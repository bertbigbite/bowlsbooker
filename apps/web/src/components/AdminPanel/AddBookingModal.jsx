import { Modal } from "./Modal";
import { formatDateTime } from "@/utils/dateUtils";

export function AddBookingModal({ 
  isOpen, 
  onClose, 
  session, 
  booking, 
  onBookingChange, 
  onSubmit, 
  submitting 
}) {
  if (!session) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!booking.playerName || !booking.playerEmail) {
      return;
    }
    const success = await onSubmit(session.id, booking.playerName, booking.playerEmail);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Booking" maxWidth="max-w-md">
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="font-medium text-gray-900">{session.name}</p>
        <p className="text-sm text-gray-600">
          {formatDateTime(session.start_time)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Player Name *
          </label>
          <input
            type="text"
            value={booking.playerName}
            onChange={(e) =>
              onBookingChange({ ...booking, playerName: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent"
            placeholder="Enter player name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={booking.playerEmail}
            onChange={(e) =>
              onBookingChange({ ...booking, playerEmail: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent"
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
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
            {submitting ? "Adding..." : "Add Booking"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
