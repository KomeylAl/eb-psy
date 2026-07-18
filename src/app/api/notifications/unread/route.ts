import {
  authHeaders,
  backendUrl,
  buildQuery,
  getAuthToken,
  normalizePaginatedResponse,
} from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = getAuthToken(req);
  const params = req.nextUrl.searchParams;
  const page = params.get("page") || "1";
  const pageSize = params.get("pageSize") || params.get("per_page") || "20";

  try {
    const query = buildQuery({
      page,
      per_page: pageSize,
    });

    const response = await fetch(
      backendUrl(`api/v1/notifications/unread${query}`),
      {
        method: "GET",
        headers: authHeaders(token),
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "خطا در دریافت اعلانات خوانده‌نشده",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(normalizePaginatedResponse(payload), {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
