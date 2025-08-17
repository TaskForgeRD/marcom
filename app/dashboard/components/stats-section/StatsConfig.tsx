import {
  Layers,
  Package,
  FileText,
  CircleCheckIcon,
  CircleXIcon,
} from "lucide-react";
import { JSX } from "react";

export interface StatItemConfig {
  key: "fitur" | "komunikasi" | "total" | "aktif" | "expired" | "dokumen";
  title: string;
  icon: JSX.Element;
  color: string;
  subtitle?: string;
}

const iconSize = 85;

export const statsConfig: StatItemConfig[] = [
  {
    key: "fitur",
    title: "Jumlah Fitur",
    icon: <Layers size={iconSize} />,
    color: "#3b82f6",
  },
  {
    key: "komunikasi",
    title: "Materi Komunikasi",
    icon: <Package size={iconSize} />,
    color: "#3b82f6",
    subtitle: "Visual",
  },
  {
    key: "aktif",
    title: "Materi Aktif",
    icon: <CircleCheckIcon size={iconSize} />,
    color: "#10b981",
    subtitle: "Visual",
  },
  {
    key: "expired",
    title: "Materi Expired",
    icon: <CircleXIcon size={iconSize} />,
    color: "#ef4444",
    subtitle: "Visual",
  },
  {
    key: "dokumen",
    title: "Jumlah Dokumen",
    icon: <FileText size={iconSize} />,
    color: "#8b5cf6",
    subtitle: "Dokumen visual saja",
  },
];
