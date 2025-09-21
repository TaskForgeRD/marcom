"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useAuthStore } from "@/stores/auth.store";

interface AppProvidersProps {
  readonly children: ReactNode;
}

/**
 * Root provider yang menggabungkan semua provider aplikasi
 */
export function AppProviders({ children }: AppProvidersProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Ensure client-side hydration is complete
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Log status token (expired atau belum) saat mount
    try {
      const raw = localStorage.getItem("marcom-auth-store");
      const token: string | null = raw ? JSON.parse(raw)?.state?.token : null;

      const isTokenExpired = (jwt?: string | null): boolean | null => {
        if (!jwt) return null;
        const parts = jwt.split(".");
        if (parts.length !== 3) return null;
        try {
          const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
          const payload = JSON.parse(payloadJson) as { exp?: number };
          if (!payload.exp) return null;
          const expired = payload.exp * 1000 <= Date.now();
          return expired;
        } catch {
          return null;
        }
      };

      const expired = isTokenExpired(token);
      if (expired === null) {
        console.log("[Auth] Status token tidak dapat ditentukan (token tidak ada/invalid)");
      } else if (expired === true) {
        console.log("[Auth] Token sudah expired");
      } else {
        console.log("[Auth] Token belum expired");
      }
    } catch (e) {
      console.log("[Auth] Gagal membaca status token:", e);
    }
  }, []);

  useEffect(() => {
    // Wrap global fetch untuk menangani token invalid (401)
    if (typeof window === "undefined") return;

    const anyWindow = window as unknown as {
      __fetchWrapped?: boolean;
      __isLoggingOut?: boolean;
      fetch: typeof window.fetch;
    };

    if (anyWindow.__fetchWrapped) return;

    const originalFetch = window.fetch.bind(window);

    anyWindow.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const response = await originalFetch(input, init);

        if (response.status === 401) {
          console.log("[Auth] Menerima 401 dari API: token invalid/expired");
          if (!anyWindow.__isLoggingOut) {
            anyWindow.__isLoggingOut = true;
            try {
              // Clear auth state and storage via store logout
              const { logout } = useAuthStore.getState();
              logout();
            } finally {
              // Redirect ke halaman login
              window.location.replace("/login");
            }
          }
        }

        return response;
      } catch (error) {
        // Jika fetch gagal karena network error, tetap lempar error
        throw error;
      }
    };

    anyWindow.__fetchWrapped = true;

    return () => {
      // Optional: we won't unwrap fetch on unmount to avoid tearing
    };
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-sm text-muted-foreground">
          Memuat aplikasi...
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
