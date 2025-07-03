"use client";

import { type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function SidebarNavigation({
  items,
  onNavigate,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  onNavigate?: () => void;
}) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const router = useRouter();

  const handleItemClick = (title: string, url: string) => {
    setActiveItem(title);
    router.push(url);
    onNavigate?.();
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={activeItem === item.title ? "bg-gray-100" : ""}
                  onClick={() => handleItemClick(item.title, item.url)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
