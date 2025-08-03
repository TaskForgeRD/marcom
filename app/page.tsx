"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth.hook";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Hanya redirect ketika loading selesai
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-muted-foreground">Memuat halaman...</p>
        </div>
      </div>
    </main>
  );
}
