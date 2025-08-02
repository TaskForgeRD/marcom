"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Database,
  Home,
  FileText,
  Settings,
  HelpCircle,
  ChevronRight,
  Tag,
  Grid3X3,
  Layers,
  Users,
  GalleryVerticalEnd,
  Bell,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Navigation items dengan Master Data yang bisa diklik
const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Master Data",
    icon: Database,
    isCollapsible: true,
    items: [
      {
        title: "Brand",
        url: "/master-data?tab=brands",
        icon: Tag,
        tabValue: "brands", // PERBAIKAN: tambahkan tabValue untuk matching yang tepat
      },
      {
        title: "Cluster",
        url: "/master-data?tab=clusters", // PERBAIKAN: ubah ke "clusters" untuk konsistensi
        icon: Grid3X3,
        tabValue: "clusters",
      },
      {
        title: "Fitur",
        url: "/master-data?tab=fitur",
        icon: Layers,
        tabValue: "fitur",
      },
      {
        title: "Jenis",
        url: "/master-data?tab=jenis",
        icon: Users,
        tabValue: "jenis",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader className="bg-gray-50 flex h-16 px-3 py-4 border-b transition-all duration-300">
        <SidebarMenuButton size="lg" onClick={toggleSidebar}>
          <div className="flex aspect-square size-6 items-center justify-center">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Dashboard Marcom</span>
          </div>
          <div className="flex aspect-square size-8 items-center justify-center">
            <Bell className="ml-auto size-7 rounded-sm p-1 border" />
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => {
            const isActive = pathname === item.url;
            // PERBAIKAN: perbaiki logic untuk mendeteksi active state pada Master Data
            const hasActiveSubItem =
              pathname === "/master-data" &&
              item.items?.some((subItem) => subItem.tabValue === currentTab);

            if (item.isCollapsible && item.items) {
              return (
                <Collapsible
                  key={item.title}
                  defaultOpen={hasActiveSubItem || pathname === "/master-data"}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          "w-full",
                          (hasActiveSubItem || pathname === "/master-data") &&
                            "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          // PERBAIKAN: gunakan tabValue untuk matching yang tepat
                          const isSubActive = currentTab === subItem.tabValue;

                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  isSubActive &&
                                    "bg-sidebar-accent text-sidebar-accent-foreground"
                                )}
                                onClick={() => isMobile && toggleSidebar()}
                              >
                                <Link href={subItem.url}>
                                  {subItem.icon && (
                                    <subItem.icon className="size-4" />
                                  )}
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={cn(
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  onClick={() => isMobile && toggleSidebar()}
                >
                  <Link href={item.url || "#"}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild>
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/70">
                <Database className="size-3" />
                <span>Marcom v1.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
