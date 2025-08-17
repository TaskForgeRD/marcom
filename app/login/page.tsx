"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth.hook";
import {
  showErrorToast,
  showSuccessToast,
} from "../dashboard/uiRama/toast-utils";

export default function LoginPage() {
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);
  const [callbackProcessed, setCallbackProcessed] = useState(false);
  const [accountNotFoundError, setAccountNotFoundError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    isAuthenticated,
    isLoading: authLoading,
    googleLogin,
    googleCallback,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const handleCallback = async () => {
      if (callbackProcessed || isProcessingCallback) {
        return;
      }

      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        const displayError = errorDescription || error || "Login dibatalkan.";
        showErrorToast(displayError);
        setCallbackProcessed(true);

        setTimeout(() => {
          window.history.replaceState({}, document.title, "/login");
        }, 100);
        return;
      }

      if (code) {
        setIsProcessingCallback(true);
        setCallbackProcessed(true);
        setAccountNotFoundError(false);
        setErrorMessage("");

        try {
          const success = await googleCallback(code);

          if (success) {
            showSuccessToast("Login berhasil!", "Mengarahkan ke dashboard...");
            window.history.replaceState({}, document.title, "/login");
            router.replace("/dashboard");
          } else {
            setErrorMessage("Login callback gagal");
            setAccountNotFoundError(false);
          }
        } catch (error: any) {
          if (
            error?.code === "USER_NOT_REGISTERED" ||
            error?.message?.includes("belum terdaftar") ||
            error?.message?.includes("not registered")
          ) {
            setAccountNotFoundError(true);
            setErrorMessage(error.message || "Akun belum terdaftar");
          } else {
            const displayError =
              error?.message || "Terjadi kesalahan saat memproses login";
            showErrorToast(displayError);
            setErrorMessage(displayError);
          }
        } finally {
          setIsProcessingCallback(false);
        }
      }
    };

    if (searchParams.toString() && !callbackProcessed) {
      handleCallback();
    }
  }, [
    searchParams,
    googleCallback,
    router,
    callbackProcessed,
    isProcessingCallback,
  ]);

  const handleGoogleLogin = async () => {
    try {
      setAccountNotFoundError(false);
      setErrorMessage("");
      setCallbackProcessed(false);
      await googleLogin();
    } catch (error: any) {
      const displayError = error?.message || "Google login gagal";
      showErrorToast(displayError);
    }
  };

  const handleTryAgain = () => {
    setAccountNotFoundError(false);
    setCallbackProcessed(false);
    setErrorMessage("");
    setIsProcessingCallback(false);
    window.location.href = "/login";
  };

  if (authLoading && !isProcessingCallback && !callbackProcessed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Memuat sistem otentikasi...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated && !accountNotFoundError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Mengarahkan ke dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (accountNotFoundError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
            </div>
            <CardTitle className="text-xl font-semibold text-red-700 dark:text-red-500">
              Akun Tidak Terdaftar
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Maaf, akun Google Anda belum terdaftar dalam sistem
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                {errorMessage ||
                  "Akun Google Anda tidak ditemukan dalam sistem kami. Silakan hubungi administrator untuk mendaftarkan akun Anda terlebih dahulu."}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleTryAgain}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4" />
                Coba Login Lagi
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Pastikan Anda menggunakan akun Google yang sudah didaftarkan
                  oleh administrator
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isProcessing = isProcessingCallback || authLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Selamat Datang di Marcom
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Masuk ke akun Anda untuk mengakses dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isProcessingCallback && (
            <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses login Google...</span>
            </div>
          )}

          {errorMessage && !accountNotFoundError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">
                {errorMessage}
              </p>
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-3 h-11"
            variant="outline"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {isProcessingCallback
                    ? "Memproses..."
                    : "Sedang memproses..."}
                </span>
              </>
            ) : (
              <>
                <Chrome className="w-4 h-4" />
                <span>Masuk dengan Google</span>
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Dengan masuk, Anda menyetujui syarat dan ketentuan yang berlaku
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
