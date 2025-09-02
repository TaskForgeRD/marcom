"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/stores/auth.store";

export const useAuth = () => {
  const store = useAuthStore();
  const hasInitialized = useRef(false);
  const initPromise = useRef<Promise<void> | null>(null);

  // Stable callback untuk mencegah infinite loop
  const initializeAuth = useCallback(async () => {
    if (hasInitialized.current || initPromise.current) {
      return initPromise.current;
    }

    hasInitialized.current = true;

    initPromise.current = (async () => {
      try {
        if (store.token && !store.user && !store.isAuthenticated) {
          await store.verifyToken();
        } else if (!store.token) {
          store.setLoading(false);
        } else if (store.token && store.user && store.isAuthenticated) {
          store.setLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        store.setLoading(false);
      }
    })();

    return initPromise.current;
  }, [
    store.token,
    store.user,
    store.isAuthenticated,
    store.verifyToken,
    store.setLoading,
  ]);

  useEffect(() => {
    // Hanya jalankan jika belum diinisialisasi dan sedang loading
    if (!hasInitialized.current && store.isLoading) {
      initializeAuth();
    }
  }, [initializeAuth, store.isLoading]);

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    logout: store.logout,
    verifyToken: store.verifyToken,
    googleLogin: store.googleLogin,
    googleCallback: store.googleCallback,
  } as const;
};
