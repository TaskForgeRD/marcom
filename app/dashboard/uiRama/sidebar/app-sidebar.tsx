"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Database,
  Home,
  ChevronRight,
  Tag,
  Grid3X3,
  Layers,
  Users,
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

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
        tabValue: "brands",
      },
      {
        title: "Cluster",
        url: "/master-data?tab=clusters",
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
  {
    title: "Users",
    url: "/users",
    icon: Users,
    isCollapsible: false,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const { toggleSidebar, state } = useSidebar();
  const isMobile = useIsMobile();

  // State untuk kontrol buka/tutup
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader className="bg-gray-50 flex h-16 px-2 py-4 border-b transition-all duration-300">
        <SidebarMenuButton
          size="lg"
          onClick={toggleSidebar}
          className="!rounded-none"
        >
          <div
            className={cn(
              "flex aspect-square items-center justify-center !rounded-none",
              isCollapsed ? "size-8 mx-auto" : "size-8"
            )}
          >
            <Image
              src="/bri_new.svg"
              alt="BRI Logo"
              width={48}
              height={48}
              className="size-12 !rounded-none"
            />
          </div>
          {!isCollapsed && (
            <>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Dashboard Marcom</span>
              </div>
              <div className="flex aspect-square size-8 items-center justify-center">
                <Bell className="ml-auto size-7 rounded-sm p-1 border" />
              </div>
            </>
          )}
        </SidebarMenuButton>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2 py-2">
        <SidebarMenu>
          {navigationItems.map((item) => {
            const isActive = pathname === item.url;
            const hasActiveSubItem =
              pathname === "/master-data" &&
              item.items?.some((subItem) => subItem.tabValue === currentTab);

            if (item.isCollapsible && item.items) {
              const isOpen =
                openMenus[item.title] ??
                (hasActiveSubItem || pathname === "/master-data");

              return (
                <SidebarMenuItem key={item.title} className="mb-1">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "w-full",
                      isOpen &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                    onClick={() => toggleMenu(item.title)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto transition-transform duration-300",
                        isOpen && "rotate-90"
                      )}
                    />
                  </SidebarMenuButton>

                  {/* Submenu dengan animasi */}
                  <div
                    className={cn(
                      "overflow-hidden transition-[max-height,opacity] duration-300",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <SidebarMenuSub className="ml-6 border-l border-sidebar-border/50 pl-4 space-y-1">
                      {item.items.map((subItem, index) => {
                        const isSubActive = currentTab === subItem.tabValue;
                        return (
                          <div
                            key={subItem.title}
                            style={{
                              transitionDelay: `${isOpen ? index * 50 : 0}ms`,
                            }} // delay agar muncul bertahap
                            className={cn(
                              "transition-opacity duration-300",
                              !isOpen && "opacity-0"
                            )}
                          >
                            <SidebarMenuSubItem>
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
                          </div>
                        );
                      })}
                    </SidebarMenuSub>
                  </div>
                </SidebarMenuItem>
              );
            }

            return (
              <SidebarMenuItem key={item.title} className="mb-1">
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
      <SidebarFooter className="px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild>
              <div className="flex items-center gap-2 px-2 py-2 text-xs text-sidebar-foreground/70">
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
