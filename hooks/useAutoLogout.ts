import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth.store";

// Parse JWT exp (in seconds) safely; return null if invalid
function getJwtExpiryMs(token: string | null | undefined): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson) as { exp?: number };
    if (!payload.exp) return null;
    return payload.exp * 1000; // seconds -> ms
  } catch {
    return null;
  }
}

function readToken(): string | null {
  try {
    const raw = localStorage.getItem("marcom-auth-store");
    return raw ? JSON.parse(raw)?.state?.token ?? null : null;
  } catch {
    return null;
  }
}

export function useAutoLogout(): void {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const scheduleLogout = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const token = readToken();
      const expMs = getJwtExpiryMs(token);
      if (!expMs) return; // no token or invalid token

      const now = Date.now();
      const delay = Math.max(0, expMs - now);

      // Schedule logout exactly at expiry; server 401 handler is also in place
      timeoutRef.current = window.setTimeout(() => {
        const { logout } = useAuthStore.getState();
        try {
          logout();
        } finally {
          window.location.replace("/login");
        }
      }, delay);
    };

    // Initial schedule
    scheduleLogout();

    // Listen for token changes via localStorage (e.g., login/logout in other tabs)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "marcom-auth-store") {
        scheduleLogout();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
}


