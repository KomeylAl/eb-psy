import {
  AUTH_TOKEN_COOKIE,
  authHeaders,
  backendUrl,
  getAuthToken,
} from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = getAuthToken(req);

  try {
    const response = await fetch(backendUrl("api/v1/auth/logout"), {
      method: "POST",
      headers: authHeaders(token, {
        "Content-Type": "application/json",
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      return NextResponse.json(
        { message: payload?.message || "Error in logging out" },
        { status: response.status }
      );
    }

    const res = NextResponse.json(
      { message: "Logged out successfully.", data: null },
      { status: 200 }
    );

    res.cookies.delete(AUTH_TOKEN_COOKIE);
    return res;
  } catch (error: unknown) {
    return NextResponse.json(
      { message: `Something went wrong ${(error instanceof Error ? error.message : "Unknown error")}` },
      { status: 500 }
    );
  }
}
