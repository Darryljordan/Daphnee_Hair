import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET /api/bookings/worker - Get all bookings (authenticated worker)
export async function GET(request: NextRequest) {
  const worker = verifyToken(request);
  if (!worker) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
  }

  try {
    const result = await pool.query("SELECT * FROM bookings ORDER BY time");
    return NextResponse.json({ bookings: result.rows });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
