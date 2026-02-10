import { NextRequest, NextResponse } from "next/server";
import { findWorkerByValidationToken, validateWorker } from "@/lib/worker";

// GET /api/workers/validate/[token]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const worker = await findWorkerByValidationToken(token);
    if (!worker) {
      return NextResponse.json(
        { error: "Invalid or expired validation token." },
        { status: 400 }
      );
    }

    await validateWorker(worker.id);

    return new NextResponse("Worker account validated successfully!", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
