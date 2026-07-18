import { authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = getAuthToken(req);

  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const response = await fetch(backendUrl("api/v1/auth/me"), {
      method: "GET",
      headers: authHeaders(token),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "Error getting profile",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: payload?.message ?? "Success",
        user: payload?.data ?? null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: `Something went wrong ${(error instanceof Error ? error.message : "Unknown error")}` },
      { status: 500 }
    );
  }
}
