import {
  authHeaders,
  backendUrl,
  getAuthToken,
} from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const token = getAuthToken(req);
  const response = await fetch(
    backendUrl(`api/v1/doctor/treatment-programs/${id}`),
    { headers: authHeaders(token) }
  );
  const payload = await response.json().catch(() => null);
  return NextResponse.json(payload, { status: response.status });
}
