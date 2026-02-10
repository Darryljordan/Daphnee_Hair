import { NextRequest, NextResponse } from "next/server";
import { findWorkerByUsernameOrEmail } from "@/lib/worker";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

// POST /api/workers/login
export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const worker = await findWorkerByUsernameOrEmail(identifier);
    if (!worker) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, worker.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    if (!worker.is_validated) {
      return NextResponse.json(
        { error: "Account not validated yet. Please wait for admin approval." },
        { status: 403 }
      );
    }

    const token = signToken({
      id: worker.id,
      username: worker.username,
      email: worker.email,
    });

    return NextResponse.json({
      message: "Login successful.",
      token,
      worker: {
        id: worker.id,
        username: worker.username,
        email: worker.email,
        created_at: worker.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
