import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// This route is called by Vercel Cron Jobs daily.
// It soft-deletes bookings whose date is more than 1 day in the past,
// and permanently deletes bookings that were soft-deleted more than 1 month ago.

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron (or allow in development)
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Soft-delete valid bookings whose date has passed by more than 1 day
    const expiredResult = await pool.query(
      `UPDATE bookings
       SET state = 'deleted'
       WHERE state = 'valid' AND date < CURRENT_DATE - INTERVAL '1 day'
       RETURNING id, name, date`
    );

    // 2. Permanently delete bookings that were soft-deleted more than 1 month ago
    const purgedResult = await pool.query(
      `DELETE FROM bookings
       WHERE state = 'deleted' AND created_at < NOW() - INTERVAL '1 month'
       RETURNING id`
    );

    return NextResponse.json({
      message: "Cleanup complete",
      expired: expiredResult.rowCount,
      purged: purgedResult.rowCount,
    });
  } catch (error) {
    console.error("Cron cleanup error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
