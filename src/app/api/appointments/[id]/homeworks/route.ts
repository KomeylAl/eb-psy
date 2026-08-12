import { authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const token = getAuthToken(req);
  const response = await fetch(
    backendUrl(`api/v1/doctor/appointments/${id}/homeworks`),
    { headers: authHeaders(token) }
  );
  const payload = await response.json().catch(() => null);
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const token = getAuthToken(req);
  const body = await req.json();
  const response = await fetch(
    backendUrl(`api/v1/doctor/appointments/${id}/homeworks`),
    {
      method: "POST",
      headers: {
        ...authHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const payload = await response.json().catch(() => null);
  return NextResponse.json(payload, { status: response.status });
}
