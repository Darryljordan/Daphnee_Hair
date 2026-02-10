import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface WorkerPayload {
  id: number;
  username: string;
  email: string;
}

export function signToken(payload: WorkerPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
}

export function verifyToken(request: NextRequest): WorkerPayload | null {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET) as WorkerPayload;
  } catch {
    return null;
  }
}
