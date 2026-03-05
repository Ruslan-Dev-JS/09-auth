import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://notehub-api.goit.study";

export async function GET(request: NextRequest) {
  try {
    const backendResponse = await axios.get(`${BASE_URL}/auth/session`, {
      withCredentials: true,
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
      },
      validateStatus: () => true,
    });

    // Якщо бекенд повертає 200 без тіла, просто віддаємо null
    const data =
      backendResponse.data && Object.keys(backendResponse.data).length > 0
        ? backendResponse.data
        : null;

    const res = NextResponse.json(data, {
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
      { message: "Session check failed" },
      { status: 500 },
    );
  }
}

