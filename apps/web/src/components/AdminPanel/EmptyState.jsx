export function EmptyState({ onCreateSession }) {
  return (
    <div className="text-center py-12">
      <p className="text-xl text-gray-600">No sessions found.</p>
      <button
        onClick={onCreateSession}
        className="mt-4 bg-[#56ccff] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#45b8e6] transition-colors"
      >
        Create Your First Session
      </button>
    </div>
  );
}
