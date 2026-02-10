import { NextRequest, NextResponse } from "next/server";
import {
  findWorkerByResetToken,
  updateWorkerPassword,
  setResetToken,
} from "@/lib/worker";

// POST /api/workers/password-reset
export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password required." },
        { status: 400 }
      );
    }

    const worker = await findWorkerByResetToken(token);
    if (!worker) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 400 }
      );
    }

    await updateWorkerPassword(worker.id, newPassword);
    // Clear the reset token
    await setResetToken(worker.email, null, null);

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
