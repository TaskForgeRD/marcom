import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { AuthState, AuthActions, AuthResponse } from "@/types/auth.types";
import { authApi, AuthApiError } from "@/lib/api/auth.api";
import { toast } from "sonner";

type AuthStore = AuthState & AuthActions;

const STORAGE_KEY = "marcom-auth-store";

export const useAuthStore = create<AuthStore>()(
  persist(
    immer<AuthStore>((set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      login: (response: AuthResponse) => {
        set((state) => {
          state.user = response.user;
          state.token = response.token;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
        toast.success(`Selamat datang, ${response.user.name}!`);
      },

      logout: () => {
        const { token } = get();

        set((state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.isLoading = false;
        });

        // Attempt to logout on server (fire and forget)
        if (token) {
          authApi.logout(token).catch((error) => {
            console.warn("Server logout failed:", error);
          });
        }

        toast.success("Anda telah keluar dari sistem");
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      verifyToken: async (): Promise<boolean> => {
        const { token } = get();

        if (!token) {
          set((state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
          });
          return false;
        }

        try {
          const user = await authApi.verifyToken(token);

          set((state) => {
            state.user = user;
            state.isAuthenticated = true;
            state.isLoading = false;
          });

          return true;
        } catch (error) {
          // Clear invalid token from storage
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;
          });

          if (error instanceof AuthApiError) {
            if (error.status === 401) {
              toast.error("Sesi Anda telah berakhir, silakan masuk kembali");
            } else if (error.code === "INVALID_USER_DATA") {
              toast.error("Data pengguna tidak valid, silakan masuk kembali");
              console.error("Invalid user data details:", error.details);
            } else {
              toast.error("Verifikasi token gagal: " + error.message);
            }
          } else {
            toast.error("Terjadi kesalahan saat memverifikasi sesi");
          }

          return false;
        }
      },

      googleLogin: async (): Promise<void> => {
        try {
          set((state) => {
            state.isLoading = true;
          });

          const { url } = await authApi.initiateGoogleLogin();
          window.location.href = url;
        } catch (error) {
          set((state) => {
            state.isLoading = false;
          });

          if (error instanceof AuthApiError) {
            toast.error(`Gagal memulai login Google: ${error.message}`);
          } else {
            toast.error("Gagal memulai proses login Google");
          }

          throw error;
        }
      },

      googleCallback: async (code: string): Promise<boolean> => {
        try {
          set((state) => {
            state.isLoading = true;
          });

          const response = await authApi.handleGoogleCallback(code);

          if (response.success && response.token && response.user) {
            get().login({
              token: response.token,
              user: response.user,
            });
            return true;
          } else {
            const errorMessage =
              response.message ||
              "Login callback failed - no token or user data received";

            // Check if it's a "user not registered" error
            if (
              response.error_code === "USER_NOT_REGISTERED" ||
              errorMessage.includes("belum terdaftar") ||
              errorMessage.includes("not registered")
            ) {
              // Create a specific error for account not found
              const accountNotFoundError = new Error(errorMessage);
              (accountNotFoundError as any).code = "USER_NOT_REGISTERED";
              throw accountNotFoundError;
            }

            throw new Error(errorMessage);
          }
        } catch (error: any) {
          set((state) => {
            state.isLoading = false;
          });

          // Handle specific error types
          if (error.code === "USER_NOT_REGISTERED") {
            // Don't show toast for this error - let the UI handle it
            throw error; // Re-throw to let UI handle it
          } else if (error instanceof AuthApiError) {
            if (error.code === "INVALID_CALLBACK_DATA") {
              toast.error("Format respons callback tidak valid");
              console.error("Invalid callback data details:", error.details);
            } else if (error.status === 403) {
              // This is likely a "user not registered" error from backend
              const accountNotFoundError = new Error(error.message);
              (accountNotFoundError as any).code = "USER_NOT_REGISTERED";
              throw accountNotFoundError;
            } else {
              toast.error(`Callback Google gagal: ${error.message}`);
            }
          } else {
            // Only show generic error toast if it's not a "user not registered" error
            if (
              !error.message?.includes("belum terdaftar") &&
              !error.message?.includes("not registered")
            ) {
              toast.error("Gagal memproses callback login Google");
            }
          }

          return false;
        }
      },
    })),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Set initial loading state based on whether we have a token
          // If we have a token, we'll need to verify it, so keep loading true
          // If no token, we can set loading to false immediately
          if (state.token) {
            state.isLoading = true;
          } else {
            state.isLoading = false;
            state.isAuthenticated = false;
          }
        }
      },
    }
  )
);
