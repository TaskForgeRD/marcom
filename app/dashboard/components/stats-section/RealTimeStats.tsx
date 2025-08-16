// app/dashboard/components/stats-section/RealTimeStats.tsx - Fixed version
import { RefreshCw, Wifi, WifiOff, Clock } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useFilterStore } from "@/stores/filter-materi.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statsConfig } from "./StatsConfig";
import StatsCard from "@/app/dashboard/uiRama/card";
import { useEffect, useRef, useMemo } from "react";

export default function RealTimeStats() {
  const {
    socket,
    connected,
    stats,
    loading,
    error,
    refreshStats,
    requestStatsWithFilters,
  } = useSocket();

  const {
    filters,
    searchQuery,
    onlyVisualDocs,
    selectedPreset,
    setTempFilter,
    applyFilters,
  } = useFilterStore();

  // Use ref to track if filters have been sent to prevent infinite requests
  const lastFiltersRef = useRef<string>("");

  // Memoize API filters to prevent recreation on every render
  const apiFilters = useMemo(
    () => ({
      search: searchQuery || "",
      status: filters.status || "",
      brand: filters.brand || "",
      cluster: filters.cluster || "",
      fitur: filters.fitur || "",
      jenis: filters.jenis || "",
      start_date: filters.start_date || "",
      end_date: filters.end_date || "",
      only_visual_docs: onlyVisualDocs,
    }),
    [filters, searchQuery, onlyVisualDocs]
  );

  // Request stats with filters when filters change
  useEffect(() => {
    if (!connected || !socket) return;

    // Create a string representation of filters to compare
    const filtersString = JSON.stringify(apiFilters);

    // Only request if filters actually changed
    if (filtersString !== lastFiltersRef.current) {
      console.log("Filters changed, requesting new stats:", apiFilters);
      lastFiltersRef.current = filtersString;

      // Add a small delay to debounce rapid filter changes
      const timeoutId = setTimeout(() => {
        requestStatsWithFilters(apiFilters);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [apiFilters, connected, socket, requestStatsWithFilters]);

  const statsMap = useMemo(
    () => ({
      total: stats?.total || 0,
      komunikasi: stats?.komunikasi || 0,
      fitur: stats?.fitur || 0,
      aktif: stats?.aktif || 0,
      expired: stats?.expired || 0,
      dokumen: stats?.dokumen || 0,
    }),
    [stats]
  );

  const hideChangeAndSubtext =
    selectedPreset === "All time" ||
    selectedPreset === "Pilih tanggal tertentu";

  const formatLastUpdated = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (err) {
      return "Invalid time";
    }
  };

  const colorsMap = {
    fitur: "default",
    komunikasi: "default",
    aktif: "success",
    expired: "error",
    dokumen: "accent",
    total: "default",
  } as const;

  // Mapping dari key stats card ke nilai filter yang sesuai
  const getFilterValue = (key: string) => {
    switch (key.toLowerCase()) {
      case "aktif":
        return "Aktif";
      case "expired":
        return "Expired";
      case "total":
      case "komunikasi":
      case "fitur":
      case "dokumen":
      default:
        return "";
    }
  };

  const handleCardClick = (key: string) => {
    const currentStatus = filters?.status;
    const targetFilterValue = getFilterValue(key);

    console.log(
      "Card clicked:",
      key,
      "Current:",
      currentStatus,
      "Target:",
      targetFilterValue
    );

    // Jika card yang diklik sudah aktif (filter sama), reset filter
    if (currentStatus === targetFilterValue && targetFilterValue !== "") {
      setTempFilter("status", "");
    } else {
      setTempFilter("status", targetFilterValue);
    }

    // Apply filter
    setTimeout(() => {
      applyFilters();
    }, 50);
  };

  return (
    <div className="space-y-4">
      {/* Real-time Status Header */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {error || !connected ? (
              <WifiOff className="h-4 w-4 text-red-500" />
            ) : (
              <Wifi className="h-4 w-4 text-green-500" />
            )}
            <Badge
              variant={error || !connected ? "destructive" : "secondary"}
              className={`text-xs ${connected && !error ? "bg-green-100 text-green-700 border border-green-300" : ""}`}
            >
              {error || !connected ? "Offline" : "Live"}
            </Badge>
          </div>

          {stats?.lastUpdated && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Updated: {formatLastUpdated(stats.lastUpdated)}</span>
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshStats}
          disabled={loading || !connected}
          className="h-8"
        >
          <RefreshCw
            className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            Real-time connection error: {error}
          </p>
        </div>
      )}

      {/* Connection Status Message */}
      {!connected && !error && (
        <div className="mx-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-600">
            Connecting to real-time server...
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 px-4">
        {statsConfig.map(({ key, title, icon }) => {
          const value = statsMap[key];
          const currentStatus = filters?.status;
          const targetFilterValue = getFilterValue(key);

          // Card aktif jika filter status cocok dengan target value dari card
          const isActive =
            currentStatus === targetFilterValue && targetFilterValue !== "";

          return (
            <div key={key} className="relative">
              <StatsCard
                title={title}
                value={loading ? "..." : value.toString()}
                change=""
                subtext=""
                icon={icon}
                active={isActive}
                showChange={false}
                color={colorsMap[key]}
                onClick={() => handleCardClick(key)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
