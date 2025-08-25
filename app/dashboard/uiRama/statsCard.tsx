import { Card, CardContent } from "@/components/ui/card";
import { JSX } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  subtext?: string;
  icon?: JSX.Element;
  showChange?: boolean;
  color?: string;
  active?: boolean;
  onClick?: () => void;
  subtitle?: string;
}

const StatsCard = ({
  title,
  value,
  change,
  subtext,
  icon,
  showChange = true,
  color,
  active = false,
  onClick,
  subtitle,
}: StatsCardProps) => {
  const getTextColor = () => {
    switch (color) {
      case "default":
        return "text-grey-600";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "accent":
        return "text-purple-600";
      default:
        return "text-gray-800";
    }
  };

  const hoverEffect = onClick ? "cursor-pointer hover:border-blue-500" : "";

  return (
    <Card
      className={`p-0 pt-3 shadow-sm border rounded-lg overflow-hidden relative transition-all ${hoverEffect} ${active ? "border-blue-500" : "border-gray-200"}`}
      onClick={() => {
        onClick?.();
      }}
    >
      <CardContent className="flex flex-col space-y-6 ">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span
              className={`text-sm font-semibold truncate ${getTextColor()} `}
            >
              {title}
            </span>
            {subtitle && (
              <span className="text-xs text-gray-500 mt-1">({subtitle})</span>
            )}
          </div>
          {icon && (
            <div
              className={`w-55 h-55 ${getTextColor()}`}
              style={{
                opacity: 0.25,
                position: "absolute",
                top: "-20px",
                right: "-20px",
              }}
            >
              {icon}
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-2xl font-bold ${getTextColor()}`}>
            {value}
          </span>
          {showChange && change && subtext && (
            <span className="text-sm text-gray-400">
              {/* {change} {subtext} */}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
