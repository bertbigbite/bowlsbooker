export function MessageBanner({ type, message, onDismiss }) {
  if (!message) return null;

  const isError = type === "error";
  const bgColor = isError ? "bg-red-50" : "bg-[#fde93f]";
  const borderColor = isError ? "border-red-300" : "border-yellow-300";
  const textColor = isError ? "text-red-700" : "text-gray-900";

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4">
      <div className={`${bgColor} border ${borderColor} rounded-xl p-4 text-center`}>
        <p className={`${textColor} font-medium`}>{message}</p>
        {isError && onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 underline mt-2 hover:no-underline"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
