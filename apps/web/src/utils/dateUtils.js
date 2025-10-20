export const formatDateTime = (timeString) => {
  return new Date(timeString).toLocaleString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getNextThursday = () => {
  const today = new Date();
  const nextThursday = new Date(today);
  nextThursday.setDate(today.getDate() + ((4 - today.getDay() + 7) % 7));
  return nextThursday.toISOString().split("T")[0];
};

export const parseSessionDateTime = (session) => {
  // Create dates and convert to local timezone
  const startDate = new Date(session.start_time);
  const endDate = new Date(session.end_time);
  const arriveByDate = new Date(session.arrive_by_time);

  // Helper function to format time consistently
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return {
    date: startDate.toISOString().split("T")[0],
    startTime: formatTime(startDate),
    endTime: formatTime(endDate),
    arriveByTime: formatTime(arriveByDate),
  };
};
