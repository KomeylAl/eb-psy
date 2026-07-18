import { authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  const token = getAuthToken(req);
  const { id } = await context.params;

  try {
    const response = await fetch(
      backendUrl(`api/v1/notifications/${id}/read`),
      {
        method: "POST",
        headers: authHeaders(token, {
          "Content-Type": "application/json",
        }),
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "خطا در علامت‌گذاری اعلان",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: payload?.message ?? "Notification marked as read.",
        data: null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: `Something went wrong: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
