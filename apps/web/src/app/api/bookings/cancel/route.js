import sql from '../../utils/sql.js';

export async function POST(request) {
  try {
    const { sessionId, playerEmail } = await request.json();

    if (!sessionId || !playerEmail) {
      return Response.json(
        { error: 'Missing required fields: sessionId, playerEmail' },
        { status: 400 }
      );
    }

    // Check if booking exists
    const booking = await sql`
      SELECT * FROM bookings
      WHERE session_id = ${sessionId} AND player_email = ${playerEmail.toLowerCase()}
    `;

    if (booking.length === 0) {
      return Response.json(
        { error: 'No booking found for this email address in this session' },
        { status: 404 }
      );
    }

    // Delete the booking
    await sql`
      DELETE FROM bookings
      WHERE session_id = ${sessionId} AND player_email = ${playerEmail.toLowerCase()}
    `;

    return Response.json({ 
      success: true, 
      message: 'Booking cancelled successfully',
      cancelledBooking: booking[0]
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return Response.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}