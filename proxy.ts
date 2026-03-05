import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const PUBLIC_AUTH_ROUTES = ["/sign-in", "/sign-up"];

function isPrivatePath(pathname: string) {
  return PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
}

function isPublicAuthPath(pathname: string) {
  return PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Не захищаємо інші маршрути
  if (!isPrivatePath(pathname) && !isPublicAuthPath(pathname)) {
    return;
  }

  const cookieHeader = req.headers.get("cookie") ?? undefined;

  let isAuthenticated = false;

  try {
    const response = await checkSession(cookieHeader);
    isAuthenticated = !!response.data;
  } catch {
    isAuthenticated = false;
  }

  // Якщо неавторизований користувач відкриває приватний маршрут → редірект на /sign-in
  if (isPrivatePath(pathname) && !isAuthenticated) {
    const url = new URL("/sign-in", req.url);
    return NextResponse.redirect(url);
  }

  // Якщо авторизований користувач відкриває публічний маршрут → редірект на /profile
  if (isPublicAuthPath(pathname) && isAuthenticated) {
    const url = new URL("/profile", req.url);
    return NextResponse.redirect(url);
  }

  // Інакше нічого не робимо (запит проходить далі)
  return;
}
