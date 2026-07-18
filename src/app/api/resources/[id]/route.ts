import {
  authHeaders,
  backendUrl,
  getAuthToken,
} from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, context: RouteContext) {
  const token = getAuthToken(req);
  const { id } = await context.params;

  try {
    const formData = await req.formData();
    const response = await fetch(
      backendUrl(`api/v1/doctor/resources/${id}`),
      {
        method: "POST",
        headers: authHeaders(token),
        body: (() => {
          formData.append("_method", "PUT");
          return formData;
        })(),
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "Error updating resource",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: payload?.message ?? "Resource updated successfully.",
        data: payload?.data ?? null,
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

export async function PATCH(req: NextRequest, context: RouteContext) {
  return PUT(req, context);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const token = getAuthToken(req);
  const { id } = await context.params;

  try {
    const response = await fetch(
      backendUrl(`api/v1/doctor/resources/${id}`),
      {
        method: "DELETE",
        headers: authHeaders(token),
      }
    );

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      return NextResponse.json(
        {
          message: payload?.message || "Error deleting resource",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
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
