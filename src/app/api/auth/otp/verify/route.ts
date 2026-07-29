import { authHeaders, backendUrl, setAuthTokenCookie } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
    const response = await fetch(backendUrl("api/v1/auth/otp/verify"), {
      method: "POST",
      headers: authHeaders(undefined, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ phone, code, type: "doctor" }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "کد واردشده نامعتبر است.",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    const token = payload?.data?.token;
    const user = payload?.data?.user;

    if (!token || !user) {
      return NextResponse.json(
        { message: "پاسخ نامعتبر از سرور دریافت شد." },
        { status: 502 }
      );
    }

    const result = NextResponse.json({
      message: payload?.message || "ورود با موفقیت انجام شد.",
      user,
      token,
      token_type: payload?.data?.token_type || "Bearer",
    });

    setAuthTokenCookie(result, token);

    return result;
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
