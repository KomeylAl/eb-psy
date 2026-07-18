import { authHeaders, backendUrl } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    const response = await fetch(backendUrl("api/v1/auth/otp/request"), {
      method: "POST",
      headers: authHeaders(undefined, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ phone, type: "doctor" }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "خطا در ارسال کد ورود",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: payload?.message || "کد ورود ارسال شد.",
        data: payload?.data ?? null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: `خطا در ارتباط با سرور: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
