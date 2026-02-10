import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { findBookingById, softDeleteBooking } from "@/lib/booking";
import { sendMail } from "@/lib/email";

// GET /api/bookings/[id] - Get a single booking
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/bookings/[id] - Soft delete a booking (worker authenticated)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const worker = verifyToken(request);
  if (!worker) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
  }

  const { id } = await params;
  const bookingId = parseInt(id);
  const booking = await findBookingById(bookingId);

  if (!booking) {
    return NextResponse.json(
      { error: "Not authorized to delete this booking." },
      { status: 403 }
    );
  }

  await softDeleteBooking(bookingId);

  // Notify booker
  try {
    await sendMail({
      to: booking.email,
      subject: "Your booking has been canceled",
      html: `<p>Dear ${booking.name},<br>Your booking on ${booking.time} has been canceled by the worker. Please contact the salon if you have questions.</p>`,
    });
  } catch {
    console.error("Failed to send cancellation email");
  }

  return NextResponse.json({ message: "Booking deleted and booker notified." });
}
