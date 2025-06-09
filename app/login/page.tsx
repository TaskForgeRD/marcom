'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth.hook';
import { showErrorToast, showSuccessToast } from '../dashboard/uiRama/toast-utils';

export default function LoginPage() {
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);
  const [callbackProcessed, setCallbackProcessed] = useState(false);
  const { isAuthenticated, isLoading: authLoading, googleLogin, googleCallback } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const handleCallback = async () => {
      if (callbackProcessed) return;

      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        console.error('OAuth error:', error, errorDescription);
        showErrorToast(errorDescription || error || "Login dibatalkan.");
        setCallbackProcessed(true);
        
        window.history.replaceState({}, document.title, '/login');
        return;
      }

      if (code && !isProcessingCallback && !callbackProcessed) {
        try {
          setIsProcessingCallback(true);
          setCallbackProcessed(true);
          console.log('Processing OAuth callback with code:', code.substring(0, 10) + '...');
          
          const success = await googleCallback(code);
          
          if (success) {
            console.log('Login callback berhasil, mengarahkan ke dashboard...');
            showSuccessToast("Login berhasil!", "Mengarahkan ke dashboard...");

            window.history.replaceState({}, document.title, '/login');
          
            setTimeout(() => {
              router.replace('/dashboard');
            }, 100);
          } else {
            console.error('Login callback failed');
            showErrorToast("Login gagal. Silakan coba lagi.");
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          showErrorToast("OAuth callback error.");
        } finally {
          setIsProcessingCallback(false);
        }
      }
    };

    if (searchParams.toString()) {
      handleCallback();
    }
  }, [searchParams, googleCallback, router, isProcessingCallback, callbackProcessed]);

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google login process...');
      await googleLogin();
    } catch (error) {
      console.error('Google login failed:', error);
      showErrorToast("Google login failed.");
    }
  };

  if (authLoading && !isProcessingCallback) {
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

  if (isAuthenticated) {
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

  const isProcessing = isProcessingCallback || authLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Selamat Datang di Marcom
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Masuk ke akun Anda untuk mengakses materi dan dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isProcessingCallback && (
            <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses login Google...</span>
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
                  {isProcessingCallback ? 'Memproses...' : 'Sedang memproses...'}
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

          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                Debug Info (Development Only)
              </summary>
              <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                <div>Auth Loading: {authLoading.toString()}</div>
                <div>Is Authenticated: {isAuthenticated.toString()}</div>
                <div>Processing Callback: {isProcessingCallback.toString()}</div>
                <div>Callback Processed: {callbackProcessed.toString()}</div>
                <div>Search Params: {searchParams.toString()}</div>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}