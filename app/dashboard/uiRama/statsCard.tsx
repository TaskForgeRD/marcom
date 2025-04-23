import { Card, CardContent } from "@/components/ui/card";
import { JSX } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon?: JSX.Element;
  subtext?: string;
  selectedPreset: string;
}

const StatsCard = ({ title, value, change, icon, subtext, selectedPreset }: StatsCardProps) => {
    const hideChangeAndSubtext = selectedPreset === "All time" || selectedPreset === "Pilih tanggal tertentu";
    return (
        <Card className="p-0 pt-3 shadow-sm border rounded-lg">
            <CardContent className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold truncate">{title}</span>
                {icon && <div className="w-5 h-5 text-gray-500">{icon}</div>}
            </div>
            <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{value}</span>
                {!hideChangeAndSubtext && (
                    <span className="text-sm text-gray-400">
                    {change} {subtext}
                    </span>
                )}

            </div>
            </CardContent>
        </Card>
    );
  };
  
  export default StatsCard;