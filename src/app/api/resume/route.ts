import { authHeaders, backendUrl, getAuthToken } from "@/lib/backend";
import { NextRequest, NextResponse } from "next/server";

const emptyResume = {
  id: null,
  doctor_id: null,
  title: "",
  bio: "",
  specialization: "",
  educations: [],
  experiences: [],
  skills: [],
  certifications: [],
  social_links: {
    linkedin: "",
    instagram: "",
    website: "",
    twitter: "",
  },
  content: "",
  file_path: null,
  file_url: null,
};

export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const response = await fetch(backendUrl("api/v1/doctor/resume"), {
      headers: authHeaders(token),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "Error getting resume",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    // Backend may return 200 with data: null when resume does not exist.
    if (payload?.data == null) {
      return NextResponse.json(
        {
          message: payload?.message ?? "Resume not found.",
          ...emptyResume,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: payload?.message ?? "Success",
        ...payload.data,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: `Something went wrong: ${(error instanceof Error ? error.message : "Unknown error")}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const formData = await req.formData();
    const response = await fetch(backendUrl("api/v1/doctor/resume"), {
      method: "POST",
      headers: authHeaders(token),
      body: formData,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: payload?.message || "Error saving resume",
          errors: payload?.errors ?? null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: payload?.message ?? "Resume saved successfully.",
        ...(payload?.data ?? {}),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: `Something went wrong: ${(error instanceof Error ? error.message : "Unknown error")}` },
      { status: 500 }
    );
  }
}
