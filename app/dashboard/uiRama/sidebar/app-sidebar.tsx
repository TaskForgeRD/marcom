"use client";

import * as React from "react";
import { Users, Home, Bell } from "lucide-react";
import Image from "next/image";

import SidebarNavigation from "@/app/dashboard/uiRama/sidebar/sidebar-navigation";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();
  return () => toggleSidebar();
}

const data = {
  navMain: [
    {
      title: "Manajemen Fitur",
      url: "/dashboard",
      icon: Home,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-gray-50 flex h-16 px-3 py-4 border-b transition-all duration-300">
        <SidebarMenuButton size="lg" onClick={CustomTrigger()}>
          <div className="flex aspect-square size-6 items-center justify-center">
            {/* Menggunakan icon dari layout */}
            <Image
              src="/bri_new.svg"
              alt="BRI Logo"
              width={24}
              height={24}
              className="size-6"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Dashboard Marcom</span>
          </div>
          <div className="flex aspect-square size-8 items-center justify-center">
            <Bell className="ml-auto size-7 rounded-sm p-1 border" />
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNavigation
          items={data.navMain}
          onNavigate={() => {
            if (isMobile) toggleSidebar();
          }}
        />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
