import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendMail } from "@/lib/email";
import crypto from "crypto";
import { verifyToken } from "@/lib/auth";

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service, date, time } = await request.json();

    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json(
        { error: "Missing required booking fields." },
        { status: 400 }
      );
    }

    // Ensure time is in "HH:MM:SS" format for interval math
    const timeInterval = time.length === 5 ? time + ":00" : time;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check for overlap (within 2 hours of any existing booking, valid state only)
      const overlapResult = await client.query(
        `SELECT * FROM bookings
         WHERE date = $1 AND state = 'valid'
         AND ABS(EXTRACT(EPOCH FROM (
           (date + time::interval) - ($1::date + $2::interval)
         ))/3600) < 2`,
        [date, timeInterval]
      );

      if (overlapResult.rows.length > 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "This time slot is not available. Please choose another." },
          { status: 400 }
        );
      }

      // Generate a secure cancel token
      const cancelToken = crypto.randomBytes(32).toString("hex");

      // Insert booking
      const result = await client.query(
        `INSERT INTO bookings (name, email, phone, service, date, time, cancel_token)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, email, phone, service, date, time, cancelToken]
      );

      const booking = result.rows[0];

      // Send confirmation email with cancellation link
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
      const cancelLink = `${baseUrl}/api/bookings/cancel/${cancelToken}`;

      try {
        await sendMail({
          to: booking.email,
          subject: "Booking Confirmation",
          html: `<p>Thank you for booking!<br>
                 Service: ${booking.service}<br>
                 Date: ${booking.date}<br>
                 Time: ${booking.time}<br>
                 <br>
                 If you need to cancel, click <a href="${cancelLink}">here</a>.</p>`,
        });
      } catch {
        // Email sending failure shouldn't block booking creation
        console.error("Failed to send confirmation email");
      }

      await client.query("COMMIT");
      return NextResponse.json(booking, { status: 201 });
    } catch (error) {
      await client.query("ROLLBACK");
      const message = error instanceof Error ? error.message : "Server error";
      return NextResponse.json({ error: message }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/bookings - Get all bookings (public list)
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/bookings - Not used at this level (see [id]/route.ts)
export async function DELETE(request: NextRequest) {
  // This handles DELETE /api/bookings?id=<id> as a fallback
  const worker = verifyToken(request);
  if (!worker) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing booking id" }, { status: 400 });
  }

  const { findBookingById, softDeleteBooking } = await import("@/lib/booking");
  const booking = await findBookingById(parseInt(id));
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  await softDeleteBooking(parseInt(id));

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
