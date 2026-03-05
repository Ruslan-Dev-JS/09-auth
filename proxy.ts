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
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let isAuthenticated = false;
  let refreshedCookies: string[] | undefined;

  // Якщо є accessToken — вважаємо користувача авторизованим
  if (accessToken) {
    isAuthenticated = true;
  } else if (refreshToken) {
    // Якщо accessToken немає, але є refreshToken — пробуємо оновити сесію
    try {
      const response = await checkSession(cookieHeader);

      const data: unknown = response.data;
      if (data && typeof data === "object" && "success" in data) {
        // Очікуємо форму { success: boolean }
        isAuthenticated = Boolean(
          (data as { success?: boolean | null }).success,
        );
      } else {
        // Фолбек, якщо бекенд повертає інший формат
        isAuthenticated = Boolean(data);
      }

      const setCookieHeader = response.headers["set-cookie"];
      if (setCookieHeader) {
        refreshedCookies = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Якщо неавторизований користувач відкриває приватний маршрут → редірект на /sign-in
  if (isPrivatePath(pathname) && !isAuthenticated) {
    const url = new URL("/sign-in", req.url);
    return NextResponse.redirect(url);
  }

  // Якщо авторизований користувач відкриває публічний маршрут → редірект на /
  if (isPublicAuthPath(pathname) && isAuthenticated) {
    const url = new URL("/", req.url);
    const res = NextResponse.redirect(url);

    if (refreshedCookies) {
      for (const cookie of refreshedCookies) {
        res.headers.append("Set-Cookie", cookie);
      }
    }

    return res;
  }

  // Якщо ми оновили токени, але не робили редірект — додаємо Set-Cookie до звичайної відповіді
  if (refreshedCookies && isAuthenticated) {
    const res = NextResponse.next();
    for (const cookie of refreshedCookies) {
      res.headers.append("Set-Cookie", cookie);
    }
    return res;
  }

  // Інакше нічого не робимо (запит проходить далі)
  return;
}
