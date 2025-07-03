// CustomTrigger.tsx
"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="p-2 rounded-md hover:bg-gray-100 md:hidden"
    >
      <GalleryVerticalEnd className="size-6" />
    </button>
  );
}
