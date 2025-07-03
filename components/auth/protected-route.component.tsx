"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth.hook";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  readonly children: ReactNode;
  readonly redirectTo?: string;
  readonly fallback?: ReactNode;
}

export const ProtectedRoute = ({
  children,
  redirectTo = "/login",
  fallback,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're certain the user is not authenticated
    // and we're not still loading
    if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to:", redirectTo);
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Memuat otentikasi...
            </span>
          </div>
        </div>
      )
    );
  }

  // Don't render anything while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
};
