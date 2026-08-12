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
  const query = buildQuery({
    page: params.get("page") || "1",
    per_page: params.get("per_page") || params.get("pageSize") || "20",
    status: params.get("status") || "",
    client_id: params.get("client_id") || "",
    search: params.get("search") || "",
  });

  const response = await fetch(
    backendUrl(`api/v1/doctor/treatment-programs${query}`),
    { headers: authHeaders(token) }
  );
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    return NextResponse.json(
      { message: payload?.message || "Error" },
      { status: response.status }
    );
  }
  return NextResponse.json(normalizePaginatedResponse(payload));
}
