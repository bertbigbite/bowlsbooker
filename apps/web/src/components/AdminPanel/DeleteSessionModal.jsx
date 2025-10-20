import { Modal } from "./Modal";

export function DeleteSessionModal({ 
  isOpen, 
  onClose, 
  session, 
  onConfirm, 
  submitting 
}) {
  if (!session) return null;

  const handleDelete = async () => {
    const success = await onConfirm(session.id);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Session" maxWidth="max-w-md">
      <div className="mb-6">
        <p className="text-gray-700">
          Are you sure you want to delete <strong>{session.name}</strong>?
        </p>
        <p className="text-sm text-red-600 mt-2">
          This will also delete all {session.booking_count} bookings for this
          session. This action cannot be undone.
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onClose}
          className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={submitting}
          className="flex-1 py-3 px-6 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {submitting ? "Deleting..." : "Delete Session"}
        </button>
      </div>
    </Modal>
  );
}
