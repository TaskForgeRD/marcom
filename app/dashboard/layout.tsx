'use client';

import { type ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route.component';
import { UserDropdown } from '@/components/auth/user-dropdown.component';
import { AppSidebar } from '@/app/dashboard/uiRama/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { CustomTrigger } from '@/app/dashboard/uiRama/sidebar/CustomTrigger';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  readonly children: ReactNode;
}

/**
 * Layout utama untuk dashboard dengan sidebar dan header yang responsif.
 * Menggunakan ProtectedRoute untuk memastikan user sudah terautentikasi.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <ProtectedRoute>
      <SidebarProvider>
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Kontainer utama */}
        <SidebarInset>
          {/* Header */}
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between bg-background/80 backdrop-blur-sm px-4 border-b transition-all duration-200">
            <div className="flex items-center space-x-3">
              {isMobile && <CustomTrigger />}
              <h1 className="text-lg font-semibold text-foreground">
                Dashboard
              </h1>
            </div>
            
            <UserDropdown showWelcome={!isMobile} />
          </header>
          
          {/* Konten utama */}
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
