import sql from "../../../utils/sql.js";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const {
      name,
      startTime,
      endTime,
      arriveByTime,
      costPerPlayer,
      maxPlayers,
      instructions,
    } = await request.json();

    if (!id) {
      return Response.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    if (!name || !startTime || !endTime || !arriveByTime) {
      return Response.json(
        {
          error:
            "Missing required fields: name, startTime, endTime, arriveByTime",
        },
        { status: 400 },
      );
    }

    // Check if session exists
    const existingSession = await sql`
      SELECT * FROM sessions WHERE id = ${id}
    `;

    if (existingSession.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    // Update the session
    const updatedSession = await sql`
      UPDATE sessions 
      SET 
        name = ${name},
        start_time = ${startTime},
        end_time = ${endTime},
        arrive_by_time = ${arriveByTime},
        cost_per_player = ${costPerPlayer || 4.0},
        max_players = ${maxPlayers || 16},
        instructions = ${instructions || ""}
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json({
      success: true,
      message: "Session updated successfully",
      session: updatedSession[0],
    });
  } catch (error) {
    console.error("Error updating session:", error);
    return Response.json(
      { error: "Failed to update session" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Check if session exists
    const session = await sql`
      SELECT * FROM sessions WHERE id = ${id}
    `;

    if (session.length === 0) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    // Delete the session (CASCADE will delete related bookings)
    await sql`
      DELETE FROM sessions WHERE id = ${id}
    `;

    return Response.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    return Response.json(
      { error: "Failed to delete session" },
      { status: 500 },
    );
  }
}
