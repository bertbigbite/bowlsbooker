import sql from '../../utils/sql.js';

export async function GET() {
  try {
    // Get all sessions (including past ones for admin view) with their booking counts and attendee details
    const sessions = await sql`
      SELECT 
        s.id,
        s.name,
        s.start_time,
        s.end_time,
        s.arrive_by_time,
        s.cost_per_player,
        s.max_players,
        s.instructions,
        s.created_at,
        COALESCE(COUNT(b.id), 0)::integer as booking_count
      FROM sessions s
      LEFT JOIN bookings b ON s.id = b.session_id
      GROUP BY s.id, s.name, s.start_time, s.end_time, s.arrive_by_time, s.cost_per_player, s.max_players, s.instructions, s.created_at
      ORDER BY s.start_time DESC
    `;

    // Get all bookings for each session
    for (const session of sessions) {
      const bookings = await sql`
        SELECT id, player_name, player_email, created_at
        FROM bookings
        WHERE session_id = ${session.id}
        ORDER BY created_at ASC
      `;
      session.bookings = bookings;
    }

    return Response.json(sessions);
  } catch (error) {
    console.error('Error fetching admin sessions:', error);
    return Response.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}