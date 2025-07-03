import { Layers, Package, Zap, Clock, FileText } from "lucide-react";
import { JSX } from "react";

export interface StatItemConfig {
  key: "fitur" | "komunikasi" | "total" | "aktif" | "expired" | "dokumen";
  title: string;
  icon: JSX.Element;
  color: string;
  subtitle?: string;
}

export const statsConfig: StatItemConfig[] = [
  {
    key: "fitur",
    title: "Jumlah Fitur",
    icon: <Layers size={16} />,
    color: "#3b82f6",
  },
  {
    key: "komunikasi",
    title: "Materi Komunikasi",
    icon: <Package size={16} />,
    color: "#3b82f6",
    subtitle: "Visual",
  },
  {
    key: "aktif",
    title: "Materi Aktif",
    icon: <Zap size={16} />,
    color: "#10b981",
    subtitle: "Visual",
  },
  {
    key: "expired",
    title: "Materi Expired",
    icon: <Clock size={16} />,
    color: "#ef4444",
    subtitle: "Visual",
  },
  {
    key: "dokumen",
    title: "Jumlah Dokumen",
    icon: <FileText size={16} />,
    color: "#8b5cf6",
    subtitle: "Dokumen visual saja",
  },
];
