import { authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const token = getAuthToken(req);
  const body = await req.json();
  const response = await fetch(
    backendUrl(`api/v1/doctor/homeworks/${id}`),
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

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const token = getAuthToken(req);
  const response = await fetch(backendUrl(`api/v1/doctor/homeworks/${id}`), {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (response.status === 204) {
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  }
  const payload = await response.json().catch(() => null);
  return NextResponse.json(payload, { status: response.status });
}
