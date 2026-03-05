import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://notehub-api.goit.study";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  try {
    const backendResponse = await axios.get(`${BASE_URL}/notes`, {
      params,
      withCredentials: true,
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
      },
      validateStatus: () => true,
    });

    const res = NextResponse.json(backendResponse.data, {
      status: backendResponse.status,
    });

    const setCookie = backendResponse.headers["set-cookie"];
    if (Array.isArray(setCookie)) {
      setCookie.forEach((cookie) => res.headers.append("set-cookie", cookie));
    } else if (typeof setCookie === "string") {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const backendResponse = await axios.post(`${BASE_URL}/notes`, body, {
      withCredentials: true,
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    });

    const res = NextResponse.json(backendResponse.data, {
      status: backendResponse.status,
    });

    const setCookie = backendResponse.headers["set-cookie"];
    if (Array.isArray(setCookie)) {
      setCookie.forEach((cookie) => res.headers.append("set-cookie", cookie));
    } else if (typeof setCookie === "string") {
      res.headers.set("set-cookie", setCookie);
    }

    return res;
  } catch {
    return NextResponse.json(
      { message: "Failed to create note" },
      { status: 500 },
    );
  }
}

