import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { updateWorkerInfo, deleteWorker } from "@/lib/worker";

// GET /api/workers/me
export async function GET(request: NextRequest) {
  const worker = verifyToken(request);
  if (!worker) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
  }

  return NextResponse.json({
    id: worker.id,
    username: worker.username,
    email: worker.email,
  });
}

// PUT /api/workers/me
export async function PUT(request: NextRequest) {
  const worker = verifyToken(request);
  if (!worker) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
  }

  try {
    const { username, email } = await request.json();
    if (!username || !email) {
      return NextResponse.json(
        { error: "Username and email required." },
        { status: 400 }
      );
    }

    const updated = await updateWorkerInfo(worker.id, { username, email });
    return NextResponse.json({ message: "Worker info updated.", worker: updated });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

// DELETE /api/workers/me
export async function DELETE(request: NextRequest) {
  const worker = verifyToken(request);
  if (!worker) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
  }

  try {
    await deleteWorker(worker.id);
    return NextResponse.json({ message: "Worker account deleted." });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
