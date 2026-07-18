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
  const pageSize = params.get("pageSize") || params.get("per_page") || "10";
  const search = params.get("search") || "";
  const date = params.get("date") || "";
  const status = params.get("status") || "";
  const paymentStatus = params.get("payment_status") || "";
  const sortBy = params.get("sort_by") || "";
  const sortDirection = params.get("sort_direction") || "";

  try {
    const query = buildQuery({
      page,
      per_page: pageSize,
      search,
      date,
      status,
      payment_status: paymentStatus,
      sort_by: sortBy,
      sort_direction: sortDirection,
    });

    const response = await fetch(
      backendUrl(`api/v1/doctor/appointments${query}`),
      {
        method: "GET",
        headers: authHeaders(token),
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "Error getting appointments",
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
