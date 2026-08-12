import { authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const token = getAuthToken(req);
  const body = await req.json();
  const response = await fetch(
    backendUrl(`api/v1/doctor/appointments/${id}/session-notes`),
    {
      method: "PATCH",
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
