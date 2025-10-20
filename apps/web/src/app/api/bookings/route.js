import sql from '../utils/sql.js';

export async function POST(request) {
  try {
    const { sessionId, playerName, playerEmail } = await request.json();

    if (!sessionId || !playerName || !playerEmail) {
      return Response.json(
        { error: 'Missing required fields: sessionId, playerName, playerEmail' },
        { status: 400 }
      );
    }

    // Check if session exists and has space
    const session = await sql`
      SELECT s.*, COALESCE(COUNT(b.id), 0)::integer as booking_count
      FROM sessions s
      LEFT JOIN bookings b ON s.id = b.session_id
      WHERE s.id = ${sessionId}
      GROUP BY s.id
    `;

    if (session.length === 0) {
      return Response.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const sessionData = session[0];
    if (sessionData.booking_count >= sessionData.max_players) {
      return Response.json(
        { error: 'Session is full' },
        { status: 400 }
      );
    }

    // Check if user already has a booking for this session
    const existingBooking = await sql`
      SELECT id FROM bookings
      WHERE session_id = ${sessionId} AND player_email = ${playerEmail.toLowerCase()}
    `;

    if (existingBooking.length > 0) {
      return Response.json(
        { error: 'You already have a booking for this session' },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await sql`
      INSERT INTO bookings (session_id, player_name, player_email)
      VALUES (${sessionId}, ${playerName}, ${playerEmail.toLowerCase()})
      RETURNING *
    `;

    return Response.json({ success: true, booking: booking[0] });
  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Check if it's a unique constraint violation
    if (error.code === '23505') {
      return Response.json(
        { error: 'You already have a booking for this session' },
        { status: 400 }
      );
    }
    
    return Response.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}