import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://notehub-api.goit.study";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const backendResponse = await axios.get(`${BASE_URL}/notes/${id}`, {
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
      { message: "Failed to fetch note" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const backendResponse = await axios.delete(`${BASE_URL}/notes/${id}`, {
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
      { message: "Failed to delete note" },
      { status: 500 },
    );
  }
}

