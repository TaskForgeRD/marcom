"use client";

import { type ReactNode } from "react";

interface DashboardLayoutProps {
  readonly children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <main className="flex-1">{children}</main>;
}
