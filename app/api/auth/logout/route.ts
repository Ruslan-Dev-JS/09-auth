import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://notehub-api.goit.study";

export async function POST(request: NextRequest) {
  try {
    const backendResponse = await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          Cookie: request.headers.get("cookie") ?? "",
        },
        validateStatus: () => true,
      },
    );

    const res = NextResponse.json(backendResponse.data ?? null, {
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
      { message: "Logout failed" },
      { status: 500 },
    );
  }
}

