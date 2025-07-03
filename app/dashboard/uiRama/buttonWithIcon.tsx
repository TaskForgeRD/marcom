import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

type ButtonWithIconProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export default function ButtonWithIcon({
  icon: Icon,
  label,
  onClick,
  className,
  type = "button",
}: ButtonWithIconProps) {
  return (
    <Button
      onClick={onClick}
      type={type}
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
    >
      <Icon size={16} className="mr-2" />
      {label}
    </Button>
  );
}
