import pool from "./db";
import bcrypt from "bcryptjs";

export async function findWorkerByValidationToken(token: string) {
  const result = await pool.query(
    "SELECT * FROM workers WHERE validation_token = $1",
    [token]
  );
  return result.rows[0];
}

export async function createWorker({
  username,
  email,
  password,
  is_validated = false,
  validation_token = null,
}: {
  username: string;
  email: string;
  password: string;
  is_validated?: boolean;
  validation_token?: string | null;
}) {
  const password_hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO workers (username, email, password_hash, is_validated, validation_token)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, username, email, created_at, is_validated, validation_token`,
    [username, email, password_hash, is_validated, validation_token]
  );
  return result.rows[0];
}

export async function findWorkerByUsernameOrEmail(identifier: string) {
  const result = await pool.query(
    `SELECT * FROM workers WHERE username = $1 OR email = $1`,
    [identifier]
  );
  return result.rows[0];
}

export async function validateWorker(id: number) {
  await pool.query(
    "UPDATE workers SET is_validated = TRUE, validation_token = NULL WHERE id = $1",
    [id]
  );
}

export async function findWorkerByEmail(email: string) {
  const result = await pool.query(
    `SELECT * FROM workers WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

export async function findWorkerById(id: number) {
  const result = await pool.query(
    `SELECT * FROM workers WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function updateWorkerPassword(id: number, newPassword: string) {
  const password_hash = await bcrypt.hash(newPassword, 10);
  await pool.query(`UPDATE workers SET password_hash = $1 WHERE id = $2`, [
    password_hash,
    id,
  ]);
}

export async function setResetToken(
  email: string,
  token: string | null,
  expires: Date | null
) {
  await pool.query(
    `UPDATE workers SET reset_token = $1, reset_token_expires = $2 WHERE email = $3`,
    [token, expires, email]
  );
}

export async function findWorkerByResetToken(token: string) {
  const result = await pool.query(
    `SELECT * FROM workers WHERE reset_token = $1 AND reset_token_expires > NOW()`,
    [token]
  );
  return result.rows[0];
}

export async function getAllWorkers() {
  const result = await pool.query(
    `SELECT id, username, email, created_at FROM workers ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function updateWorkerInfo(
  id: number,
  { username, email }: { username: string; email: string }
) {
  const result = await pool.query(
    `UPDATE workers SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, created_at`,
    [username, email, id]
  );
  return result.rows[0];
}

export async function deleteWorker(id: number) {
  await pool.query(`DELETE FROM workers WHERE id = $1`, [id]);
}
