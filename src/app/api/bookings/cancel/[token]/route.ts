import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendMail } from "@/lib/email";

// POST /api/bookings/cancel/[token] - Cancel a booking via token
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE cancel_token = $1 AND state = 'valid'`,
      [token]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired cancellation link." },
        { status: 400 }
      );
    }

    const booking = result.rows[0];

    await pool.query(`UPDATE bookings SET state = 'deleted' WHERE id = $1`, [
      booking.id,
    ]);

    try {
      await sendMail({
        to: booking.email,
        subject: "Booking Canceled",
        html: `<p>Your booking for ${booking.service} on ${booking.date} at ${booking.time} has been canceled.</p>`,
      });
    } catch {
      console.error("Failed to send cancellation email");
    }

    return NextResponse.json({ message: "Booking canceled successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
