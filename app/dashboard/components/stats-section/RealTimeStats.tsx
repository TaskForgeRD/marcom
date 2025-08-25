import { Wifi, WifiOff, Clock } from "lucide-react";
import { useStatsData } from "@/hooks/useStatsData";
import { Badge } from "@/components/ui/badge";
import { statsConfig } from "./StatsConfig";
import StatsCard from "@/app/dashboard/uiRama/statsCard";
import { useFilterStore } from "@/stores/filter-materi.store";
import { useMateri } from "@/stores/materi.store";

export default function RealTimeStats() {
  const { setStatusQuery } = useFilterStore();
  const { fetchData } = useMateri();

  const {
    selectedPreset,
    waktuLabel,
    stats,
    loading,
    error,
    lastUpdated,
    totalFitur,
  } = useStatsData();

  const statsMap = {
    total: stats.total,
    komunikasi: stats.komunikasi,
    fitur: stats.fitur,
    aktif: stats.aktif,
    expired: stats.expired,
    dokumen: stats.dokumen,
  };

  const hideChangeAndSubtext =
    selectedPreset === "All time" ||
    selectedPreset === "Pilih tanggal tertentu";

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleCardClick = (key: string) => {
    if (key === "expired") {
      setStatusQuery("Expired");
      fetchData(1, { search: "expired" });
    } else if (key === "aktif") {
      setStatusQuery("Aktif");
      fetchData(1, { search: "aktif" });
    }
  };

  const colorsMap = {
    fitur: "default",
    komunikasi: "default",
    aktif: "success",
    expired: "error",
    dokumen: "accent",
    total: "default",
  };

  return (
    <div className="space-y-4">
      {/* Real-time Status Header */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {error ? (
              <WifiOff className="h-4 w-4 text-red-500" />
            ) : (
              <Wifi className="h-4 w-4 text-green-500" />
            )}
            <Badge
              variant={error ? "destructive" : "secondary"}
              className={`text-xs ${!error ? "bg-green-100 text-green-700 border border-green-300" : ""}`}
            >
              {error ? "Offline" : "Live"}
            </Badge>
          </div>

          {lastUpdated && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Updated: {formatLastUpdated(lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            Real-time connection error: {error}
          </p>
        </div>
      )}

      {/* Stats Grid - READ ONLY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 px-4">
        {statsConfig.map(({ key, title, icon }) => {
          const { now, changeLabel } = statsMap[key];
          const clickHandler =
            key === "expired" || key === "aktif"
              ? () => handleCardClick(key)
              : undefined;

          // For fitur, use totalFitur as current value instead of data.now
          const currentValue = key === "fitur" ? totalFitur : now;

          return (
            <div key={key} className="relative">
              <StatsCard
                title={title}
                value={loading ? "..." : currentValue.toString()}
                change={changeLabel}
                subtext={waktuLabel}
                icon={icon}
                active={false} // No active cards - read-only
                showChange={!hideChangeAndSubtext}
                color={colorsMap[key]}
                onClick={clickHandler}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
