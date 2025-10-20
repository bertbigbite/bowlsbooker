import sql from '../utils/sql.js';

export async function GET() {
  try {
    // Get all sessions with their booking counts and attendee details
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
      WHERE s.start_time >= CURRENT_DATE
      GROUP BY s.id, s.name, s.start_time, s.end_time, s.arrive_by_time, s.cost_per_player, s.max_players, s.instructions, s.created_at
      ORDER BY s.start_time ASC
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
    console.error('Error fetching sessions:', error);
    return Response.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, startTime, endTime, arriveByTime, costPerPlayer, maxPlayers, instructions } = await request.json();

    if (!name || !startTime || !endTime || !arriveByTime) {
      return Response.json(
        { error: 'Missing required fields: name, startTime, endTime, arriveByTime' },
        { status: 400 }
      );
    }

    const session = await sql`
      INSERT INTO sessions (name, start_time, end_time, arrive_by_time, cost_per_player, max_players, instructions)
      VALUES (${name}, ${startTime}, ${endTime}, ${arriveByTime}, ${costPerPlayer || 4.00}, ${maxPlayers || 16}, ${instructions || ''})
      RETURNING *
    `;

    return Response.json(session[0]);
  } catch (error) {
    console.error('Error creating session:', error);
    return Response.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}