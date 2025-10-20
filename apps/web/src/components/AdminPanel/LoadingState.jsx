export function LoadingState() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56ccff] mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading admin panel...</p>
      </div>
    </div>
  );
}
