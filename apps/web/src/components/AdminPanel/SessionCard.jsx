import { Calendar, Clock, Users, Edit, Trash2, X } from "lucide-react";
import { formatDateTime } from "@/utils/dateUtils";

export function SessionCard({ 
  session, 
  onEdit, 
  onDelete, 
  onManageBookings, 
  onRemoveBooking,
  submitting 
}) {
  const availableSpots = session.max_players - session.booking_count;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {session.name}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDateTime(session.start_time)} -{" "}
                  {new Date(session.end_time).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>
                  Arrive by{" "}
                  {new Date(session.arrive_by_time).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-semibold">
                  £{parseFloat(session.cost_per_player).toFixed(2)} per player
                </span>
                <span
                  className={`font-medium ${
                    availableSpots <= 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {session.booking_count}/{session.max_players} booked
                </span>
              </div>
            </div>
            {session.instructions && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">{session.instructions}</p>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(session)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit session"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => onManageBookings(session)}
              className="p-2 text-[#56ccff] hover:bg-blue-50 rounded-lg transition-colors"
              title="Manage bookings"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(session)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete session"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Attendee List */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <Users className="w-4 h-4" />
            <span className="font-medium">Bookings ({session.booking_count})</span>
          </div>
          {session.bookings && session.bookings.length > 0 ? (
            <div className="space-y-2">
              {session.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                >
                  <div>
                    <span className="font-medium text-gray-900">
                      {booking.player_name}
                    </span>
                    <span className="text-gray-600 ml-2">
                      ({booking.player_email})
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveBooking(booking.id)}
                    disabled={submitting}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    title="Remove booking"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No bookings yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
