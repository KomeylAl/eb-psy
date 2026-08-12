import {
  authHeaders,
  backendUrl,
  getAuthToken,
} from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const token = getAuthToken(req);
  const { clientId } = await params;

  try {
    const response = await fetch(
      backendUrl(`api/v1/doctor/clients/${clientId}/medical-record`),
      {
        method: "GET",
        headers: authHeaders(token),
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "Error getting medical record",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const token = getAuthToken(req);
  const { clientId } = await params;

  try {
    const formData = await req.formData();
    const response = await fetch(
      backendUrl(`api/v1/doctor/clients/${clientId}/medical-record`),
      {
        method: "POST",
        headers: authHeaders(token),
        body: formData,
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "Error saving medical record",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
