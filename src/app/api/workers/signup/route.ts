import { NextRequest, NextResponse } from "next/server";
import {
  createWorker,
  findWorkerByUsernameOrEmail,
} from "@/lib/worker";
import { sendMail } from "@/lib/email";
import crypto from "crypto";

// POST /api/workers/signup
export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing =
      (await findWorkerByUsernameOrEmail(username)) ||
      (await findWorkerByUsernameOrEmail(email));
    if (existing) {
      return NextResponse.json(
        { error: "Username or email already in use." },
        { status: 409 }
      );
    }

    // Generate validation token
    const validation_token = crypto.randomBytes(32).toString("hex");

    const worker = await createWorker({
      username,
      email,
      password,
      is_validated: false,
      validation_token,
    });

    // Build validation URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const validationUrl = `${baseUrl}/api/workers/validate/${validation_token}`;

    // Send email to admin
    try {
      await sendMail({
        to: process.env.FROM_EMAIL || "",
        subject: "New Worker Signup Request",
        html: `
          <p>A new worker has requested to join:</p>
          <ul>
            <li>Username: ${username}</li>
            <li>Email: ${email}</li>
          </ul>
          <p>To approve this worker, click <a href="${validationUrl}">here</a>.</p>
        `,
      });
    } catch {
      console.error("Failed to send admin notification email");
    }

    return NextResponse.json(
      { message: "Worker created successfully.", worker },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
