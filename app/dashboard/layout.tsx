// app/dashboard/layout.tsx
"use client"

import { ReactNode } from "react";
import { UserCircle, LogOut } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProtectedRoute from "@/app/dashboard/components/ProtectedRoute";

import { AppSidebar } from "@/app/dashboard/uiRama/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster"

import { CustomTrigger } from "@/app/dashboard/uiRama/sidebar/CustomTrigger";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  readonly children: ReactNode;
}

/**
 * Layout utama untuk dashboard dengan sidebar dan header.
 */
export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        {/* Sidebar */}
        <AppSidebar />

        {/* Kontainer utama */}
        <SidebarInset>
          {/* Header */}
          <header
            className="
              sticky top-0 z-50 flex h-16 shrink-0 items-center 
              justify-between bg-gray-50 px-4 border-b transition-[width,height] ease-linear"
          >
            <div className="flex items-center space-x-2">
              {isMobile && <CustomTrigger />}
              <span className="text-base font-semibold text-gray-800">
                Welcome, {user?.name}
              </span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2 rounded-full hover:bg-gray-100 transition-all">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <UserCircle className="size-6" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Konten utama */}
          <main>{children}</main>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}