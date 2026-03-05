import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://notehub-api.goit.study";

export async function GET(request: NextRequest) {
  try {
    const backendResponse = await axios.get(`${BASE_URL}/users/me`, {
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
      { message: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();

  try {
    const backendResponse = await axios.patch(`${BASE_URL}/users/me`, body, {
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
      { message: "Failed to update user" },
      { status: 500 },
    );
  }
}

