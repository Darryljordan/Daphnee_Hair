import pool from "./db";

export async function findBookingById(id: number) {
  const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [id]);
  return result.rows[0];
}

export async function deleteBooking(id: number) {
  await pool.query("DELETE FROM bookings WHERE id = $1", [id]);
}

export async function softDeleteBooking(id: number) {
  await pool.query("UPDATE bookings SET state = 'deleted' WHERE id = $1", [id]);
}
