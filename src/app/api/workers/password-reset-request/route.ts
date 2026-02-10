import { NextRequest, NextResponse } from "next/server";
import { findWorkerByEmail, setResetToken } from "@/lib/worker";
import { sendMail } from "@/lib/email";
import crypto from "crypto";

// POST /api/workers/password-reset-request
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required." }, { status: 400 });
    }

    const worker = await findWorkerByEmail(email);
    if (!worker) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        message: "If this email exists, a reset link will be sent.",
      });
    }

    // Generate token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await setResetToken(email, token, expires);

    // Send email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const resetUrl = `${baseUrl}/worker-password-reset?token=${token}`;

    try {
      await sendMail({
        to: email,
        subject: "Password Reset Request",
        text: `Reset your password: ${resetUrl}`,
        html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
      });
    } catch {
      console.error("Failed to send reset email");
    }

    return NextResponse.json({
      message: "If this email exists, a reset link will be sent.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
