'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Clock, Calendar, ChevronDown, ChevronUp, X } from 'lucide-react';

export default function BowlsClubBooking() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSessions, setExpandedSessions] = useState({});
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '' });
  const [cancelForm, setCancelForm] = useState({ email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch sessions data
  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/sessions');
      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
      }
      const data = await response.json();
      setSessions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Unable to load sessions. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Polling for real-time updates
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [fetchSessions]);

  // Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSession || !bookingForm.name.trim() || !bookingForm.email.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          playerName: bookingForm.name.trim(),
          playerEmail: bookingForm.email.trim().toLowerCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }

      setSuccessMessage('Booking confirmed successfully!');
      setBookingForm({ name: '', email: '' });
      setShowBookingModal(false);
      fetchSessions(); // Refresh data
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancellation
  const handleCancellation = async (e) => {
    e.preventDefault();
    if (!selectedSession || !cancelForm.email.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          playerEmail: cancelForm.email.trim().toLowerCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Cancellation failed');
      }

      setSuccessMessage('Booking cancelled successfully!');
      setCancelForm({ email: '' });
      setShowCancelModal(false);
      fetchSessions(); // Refresh data
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Cancellation error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAttendeeList = (sessionId) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  const openBookingModal = (session) => {
    setSelectedSession(session);
    setShowBookingModal(true);
    setError(null);
  };

  const openCancelModal = (session) => {
    setSelectedSession(session);
    setShowCancelModal(true);
    setError(null);
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timeString) => {
    return new Date(timeString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56ccff] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-inter">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Indoor Bowls Club
          </h1>
          <p className="text-lg text-gray-600 text-center mt-2">
            Book your bowling session - £4.00 per player
          </p>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="bg-[#fde93f] border border-yellow-300 rounded-xl p-4 text-center">
            <p className="text-gray-900 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 underline mt-2 hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* How to Book Guide */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Book</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#56ccff] rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
              <p>Choose your preferred session from the options below</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#56ccff] rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
              <p>Click "Book Session" and enter your name and email</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#56ccff] rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
              <p>To cancel, use the "Cancel Booking" option with your email</p>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {sessions.map((session) => {
            const isExpanded = expandedSessions[session.id];
            const availableSpots = session.max_players - session.booking_count;
            const isFull = availableSpots <= 0;

            return (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                role="article"
                aria-label={`${session.name} bowling session`}
              >
                {/* Session Header */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {session.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(session.start_time)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                        <span className="text-[#56ccff] font-medium ml-2">
                          (arrive by {formatTime(session.arrive_by_time)})
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg text-gray-900">
                        £{parseFloat(session.cost_per_player).toFixed(2)} per player
                      </span>
                      <span className={`font-medium ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                        {isFull ? 'Session Full' : `${availableSpots} of ${session.max_players} spaces remaining`}
                      </span>
                    </div>
                  </div>
                  {session.instructions && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{session.instructions}</p>
                    </div>
                  )}
                </div>

                {/* Attendee List */}
                <div className="p-6">
                  <button
                    onClick={() => toggleAttendeeList(session.id)}
                    className="flex items-center justify-between w-full text-left mb-4 hover:text-[#56ccff] transition-colors"
                    aria-expanded={isExpanded}
                    aria-controls={`attendee-list-${session.id}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">
                        Players ({session.booking_count}/{session.max_players})
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div id={`attendee-list-${session.id}`} className="mb-4">
                      {session.bookings && session.bookings.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {session.bookings.map((booking, index) => (
                            <div
                              key={booking.id}
                              className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700"
                            >
                              {booking.player_name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic">No bookings yet</p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => openBookingModal(session)}
                      disabled={isFull}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-200 ${
                        isFull 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-[#56ccff] text-white hover:bg-[#45b8e6] active:bg-[#3a9dd9] shadow-md hover:shadow-lg'
                      }`}
                      aria-label={`Book ${session.name}`}
                    >
                      {isFull ? 'Session Full' : 'Book Session'}
                    </button>
                    <button
                      onClick={() => openCancelModal(session)}
                      className="flex-1 py-3 px-6 rounded-xl font-semibold text-sm uppercase tracking-wider border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
                      aria-label={`Cancel booking for ${session.name}`}
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sessions.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No sessions available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later.</p>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Book Session</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close booking modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedSession.name}</p>
              <p className="text-sm text-gray-600">
                {formatDate(selectedSession.start_time)} • {formatTime(selectedSession.start_time)} - {formatTime(selectedSession.end_time)}
              </p>
              <p className="text-sm text-[#56ccff] font-medium">
                Cost: £{parseFloat(selectedSession.cost_per_player).toFixed(2)}
              </p>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent text-lg"
                  placeholder="Enter your full name"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="booking-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="booking-email"
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent text-lg"
                  placeholder="Enter your email address"
                  required
                  aria-required="true"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !bookingForm.name.trim() || !bookingForm.email.trim()}
                  className="flex-1 py-3 px-6 bg-[#56ccff] text-white rounded-lg font-semibold hover:bg-[#45b8e6] disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Cancel Booking</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close cancellation modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">{selectedSession.name}</p>
              <p className="text-sm text-gray-600">
                {formatDate(selectedSession.start_time)} • {formatTime(selectedSession.start_time)} - {formatTime(selectedSession.end_time)}
              </p>
            </div>

            <form onSubmit={handleCancellation} className="space-y-4">
              <div>
                <label htmlFor="cancel-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="cancel-email"
                  type="email"
                  value={cancelForm.email}
                  onChange={(e) => setCancelForm({ email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56ccff] focus:border-transparent text-lg"
                  placeholder="Enter the email used for booking"
                  required
                  aria-required="true"
                />
              </div>

              <p className="text-sm text-gray-600">
                Enter the email address you used when making the booking to confirm cancellation.
              </p>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                  disabled={submitting}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting || !cancelForm.email.trim()}
                  className="flex-1 py-3 px-6 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
      `}</style>
    </div>
  );
}