import sql from '../../../utils/sql.js';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Check if booking exists
    const booking = await sql`
      SELECT * FROM bookings WHERE id = ${id}
    `;

    if (booking.length === 0) {
      return Response.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Delete the booking
    await sql`
      DELETE FROM bookings WHERE id = ${id}
    `;

    return Response.json({ 
      success: true, 
      message: 'Booking removed successfully',
      removedBooking: booking[0]
    });
  } catch (error) {
    console.error('Error removing booking:', error);
    return Response.json(
      { error: 'Failed to remove booking' },
      { status: 500 }
    );
  }
}