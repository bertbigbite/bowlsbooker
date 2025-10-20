import { useState, useEffect } from "react";

export function useAdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/admin/sessions");
      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
      }
      const data = await response.json();
      setSessions(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Unable to load sessions. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const toUTCISOString = (date, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const [year, month, day] = date.split("-").map(Number); // date format: "YYYY-MM-DD"
    const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    return utcDate.toISOString();
  };

  const createSession = async (sessionData) => {
    setSubmitting(true);
    try {
      const startDateTime = toUTCISOString(
        sessionData.date,
        sessionData.startTime
      );
      const endDateTime = toUTCISOString(sessionData.date, sessionData.endTime);
      const arriveByDateTime = toUTCISOString(
        sessionData.date,
        sessionData.arriveByTime
      );

      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sessionData.name,
          startTime: startDateTime,
          endTime: endDateTime,
          arriveByTime: arriveByDateTime,
          costPerPlayer: parseFloat(sessionData.costPerPlayer),
          maxPlayers: parseInt(sessionData.maxPlayers),
          instructions: sessionData.instructions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create session");
      }

      showSuccess("Session created successfully!");
      fetchSessions();
      return true;
    } catch (err) {
      console.error("Create session error:", err);
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateSession = async (sessionData) => {
    setSubmitting(true);
    try {
      const startDateTime = toUTCISOString(
        sessionData.date,
        sessionData.startTime
      );
      const endDateTime = toUTCISOString(sessionData.date, sessionData.endTime);
      const arriveByDateTime = toUTCISOString(
        sessionData.date,
        sessionData.arriveByTime
      );

      const response = await fetch(`/api/admin/sessions/${sessionData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sessionData.name,
          startTime: startDateTime,
          endTime: endDateTime,
          arriveByTime: arriveByDateTime,
          costPerPlayer: parseFloat(sessionData.costPerPlayer),
          maxPlayers: parseInt(sessionData.maxPlayers),
          instructions: sessionData.instructions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update session");
      }

      showSuccess("Session updated successfully!");
      fetchSessions();
      return true;
    } catch (err) {
      console.error("Edit session error:", err);
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSession = async (sessionId) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete session");
      }

      showSuccess("Session deleted successfully!");
      fetchSessions();
      return true;
    } catch (err) {
      console.error("Delete session error:", err);
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const addBooking = async (sessionId, playerName, playerEmail) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          playerName: playerName.trim(),
          playerEmail: playerEmail.trim().toLowerCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add booking");
      }

      showSuccess("Booking added successfully!");
      fetchSessions();
      return true;
    } catch (err) {
      console.error("Add booking error:", err);
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const removeBooking = async (bookingId) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove booking");
      }

      showSuccess("Booking removed successfully!");
      fetchSessions();
      return true;
    } catch (err) {
      console.error("Remove booking error:", err);
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    sessions,
    loading,
    error,
    setError,
    submitting,
    successMessage,
    createSession,
    updateSession,
    deleteSession,
    addBooking,
    removeBooking,
  };
}