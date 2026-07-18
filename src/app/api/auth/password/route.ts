import { authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = getAuthToken(req);

  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const response = await fetch(backendUrl("api/v1/auth/password"), {
      method: "POST",
      headers: authHeaders(token, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        code: body.code,
        password: body.password,
        password_confirmation: body.password_confirmation,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "خطا در تغییر رمز عبور",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: payload?.message || "رمز عبور با موفقیت تغییر کرد.",
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
