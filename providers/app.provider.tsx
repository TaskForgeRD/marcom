"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";

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
