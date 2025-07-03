import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth.store";

export const useAuth = () => {
  const store = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const initializeAuth = async () => {
      if (store.token && !store.user && !store.isAuthenticated) {
        console.log("Token found but no user, verifying token...");
        await store.verifyToken();
      } else if (!store.token) {
        console.log("No token found, setting as unauthenticated");
        store.setLoading(false);
      } else if (store.token && store.user && store.isAuthenticated) {
        console.log("Already authenticated, setting loading to false");
        store.setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        initializeAuth();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    store.token,
    store.user,
    store.isAuthenticated,
    store.verifyToken,
    store.setLoading,
  ]);

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
