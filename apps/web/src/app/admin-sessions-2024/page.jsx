"use client";

import React, { useState } from "react";
import { useAdminSessions } from "@/hooks/useAdminSessions";
import { getNextThursday, parseSessionDateTime } from "@/utils/dateUtils";
import { AdminHeader } from "@/components/AdminPanel/AdminHeader";
import { MessageBanner } from "@/components/AdminPanel/MessageBanner";
import { SessionCard } from "@/components/AdminPanel/SessionCard";
import { CreateSessionModal } from "@/components/AdminPanel/CreateSessionModal";
import { EditSessionModal } from "@/components/AdminPanel/EditSessionModal";
import { DeleteSessionModal } from "@/components/AdminPanel/DeleteSessionModal";
import { AddBookingModal } from "@/components/AdminPanel/AddBookingModal";
import { LoadingState } from "@/components/AdminPanel/LoadingState";
import { EmptyState } from "@/components/AdminPanel/EmptyState";

export default function AdminPanel() {
  const {
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
  } = useAdminSessions();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditBookingModal, setShowEditBookingModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const [newSession, setNewSession] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    arriveByTime: "",
    costPerPlayer: 4.0,
    maxPlayers: 16,
    instructions: "",
  });

  const [editSession, setEditSession] = useState({
    id: "",
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    arriveByTime: "",
    costPerPlayer: 4.0,
    maxPlayers: 16,
    instructions: "",
  });

  const [newBooking, setNewBooking] = useState({
    playerName: "",
    playerEmail: "",
  });

  const handleCreateSession = async (sessionData) => {
    const success = await createSession(sessionData);
    if (success) {
      setNewSession({
        name: "",
        date: "",
        startTime: "",
        endTime: "",
        arriveByTime: "",
        costPerPlayer: 4.0,
        maxPlayers: 16,
        instructions: "",
      });
    }
    return success;
  };

  const handleEditSession = async (sessionData) => {
    const success = await updateSession(sessionData);
    if (success) {
      setEditSession({
        id: "",
        name: "",
        date: "",
        startTime: "",
        endTime: "",
        arriveByTime: "",
        costPerPlayer: 4.0,
        maxPlayers: 16,
        instructions: "",
      });
    }
    return success;
  };

  const handleDeleteSession = async (sessionId) => {
    const success = await deleteSession(sessionId);
    if (success) {
      setSelectedSession(null);
    }
    return success;
  };

  const handleAddBooking = async (sessionId, playerName, playerEmail) => {
    const success = await addBooking(sessionId, playerName, playerEmail);
    if (success) {
      setNewBooking({ playerName: "", playerEmail: "" });
    }
    return success;
  };

  const openEditModal = (session) => {
    const parsedDates = parseSessionDateTime(session);
    setEditSession({
      id: session.id,
      name: session.name,
      date: parsedDates.date,
      startTime: parsedDates.startTime,
      endTime: parsedDates.endTime,
      arriveByTime: parsedDates.arriveByTime,
      costPerPlayer: parseFloat(session.cost_per_player),
      maxPlayers: session.max_players,
      instructions: session.instructions || "",
    });
    setShowEditModal(true);
  };

  const quickCreateThursdaySessions = () => {
    const nextThursday = getNextThursday();
    setNewSession({
      name: "Session 1 – 12:30–2:30",
      date: nextThursday,
      startTime: "12:30",
      endTime: "14:30",
      arriveByTime: "12:20",
      costPerPlayer: 4.0,
      maxPlayers: 16,
      instructions: "Please arrive by 12:20",
    });
    setShowCreateModal(true);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-inter">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <AdminHeader
        onCreateSession={() => setShowCreateModal(true)}
        onQuickCreateThursday={quickCreateThursdaySessions}
      />

      <MessageBanner type="success" message={successMessage} />
      <MessageBanner type="error" message={error} onDismiss={() => setError(null)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={openEditModal}
              onDelete={(session) => {
                setSelectedSession(session);
                setShowDeleteModal(true);
              }}
              onManageBookings={(session) => {
                setSelectedSession(session);
                setShowEditBookingModal(true);
              }}
              onRemoveBooking={removeBooking}
              submitting={submitting}
            />
          ))}
        </div>

        {sessions.length === 0 && (
          <EmptyState onCreateSession={() => setShowCreateModal(true)} />
        )}
      </main>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        session={newSession}
        onSessionChange={setNewSession}
        onSubmit={handleCreateSession}
        submitting={submitting}
      />

      <EditSessionModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        session={editSession}
        onSessionChange={setEditSession}
        onSubmit={handleEditSession}
        submitting={submitting}
      />

      <DeleteSessionModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        session={selectedSession}
        onConfirm={handleDeleteSession}
        submitting={submitting}
      />

      <AddBookingModal
        isOpen={showEditBookingModal}
        onClose={() => setShowEditBookingModal(false)}
        session={selectedSession}
        booking={newBooking}
        onBookingChange={setNewBooking}
        onSubmit={handleAddBooking}
        submitting={submitting}
      />

      <style jsx global>{`
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
      `}</style>
    </div>
  );
}
