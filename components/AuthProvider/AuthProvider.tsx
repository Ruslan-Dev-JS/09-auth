"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

const PRIVATE_PREFIXES = ["/profile", "/notes"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function verifySession() {
      setIsChecking(true);
      try {
        const user = await checkSession();
        if (isCancelled) return;

        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (isPrivatePath(pathname)) {
            await logout().catch(() => undefined);
            router.replace("/sign-in");
          }
        }
      } finally {
        if (!isCancelled) {
          setIsChecking(false);
        }
      }
    }

    verifySession();

    return () => {
      isCancelled = true;
    };
  }, [pathname, clearIsAuthenticated, router, setUser]);

  if (isPrivatePath(pathname) && isChecking) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <p>Checking session...</p>
      </main>
    );
  }

  return children;
}

