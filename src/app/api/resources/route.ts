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
  const type = params.get("type") || "";
  const sortBy = params.get("sort_by") || "";
  const sortDirection = params.get("sort_direction") || "";

  try {
    const query = buildQuery({
      page,
      per_page: pageSize,
      search,
      type,
      sort_by: sortBy,
      sort_direction: sortDirection,
    });

    const response = await fetch(
      backendUrl(`api/v1/doctor/resources${query}`),
      {
        method: "GET",
        headers: authHeaders(token),
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "Error getting resources",
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

export async function POST(req: NextRequest) {
  const token = getAuthToken(req);

  try {
    const formData = await req.formData();
    const response = await fetch(backendUrl("api/v1/doctor/resources"), {
      method: "POST",
      headers: authHeaders(token),
      body: formData,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "Error creating resource",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: payload?.message ?? "Resource created successfully.",
        data: payload?.data ?? null,
      },
      { status: response.status === 201 ? 201 : 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: `Something went wrong: ${(error instanceof Error ? error.message : "Unknown error")}` },
      { status: 500 }
    );
  }
}
