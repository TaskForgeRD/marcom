"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { useSocket } from "@/hooks/useSocket";
import { ChartCard } from "@/app/dashboard/uiRama/chart/ChartCard";
import { statsConfig } from "@/app/dashboard/components/stats-section/StatsConfig";
import { useFilterStore } from "@/stores/filter-materi.store";

export default function StatsChartCard() {
  const { socket, connected, stats, requestStatsWithFilters } = useSocket();

  const { filters, searchQuery, onlyVisualDocs } = useFilterStore();

  const lastFiltersRef = useRef<string>("");

  // Buat filter object yang sama dengan RealTimeStats
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

  // Effect untuk menerapkan filter yang sama dengan RealTimeStats
  useEffect(() => {
    if (!connected || !socket) return;

    const filtersString = JSON.stringify(apiFilters);

    if (filtersString !== lastFiltersRef.current) {
      lastFiltersRef.current = filtersString;

      const timeoutId = setTimeout(() => {
        requestStatsWithFilters(apiFilters);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [apiFilters, connected, socket, requestStatsWithFilters]);

  const getStatsData = (key: string) => {
    const currentValue = (stats?.[key as keyof typeof stats] as number) || 0;

    const chartData =
      stats?.monthlyData?.[key as keyof typeof stats.monthlyData] || [];

    return {
      now: currentValue,
      chartData: chartData,
    };
  };

  return (
    <div className="flex flex-wrap gap-4 px-4 py-4">
      {statsConfig.map((item, index) => {
        const data = getStatsData(item.key);

        let cardClass = "w-full";
        if (index < 3) {
          cardClass += " lg:w-[calc(33.333%-1rem)]";
        } else if (statsConfig.length === 4 && index === 3) {
          cardClass += " lg:w-full";
        } else if (statsConfig.length === 5 && index >= 3) {
          cardClass += " lg:w-[calc(50%-0.5rem)]";
        } else if (statsConfig.length >= 6 && index >= 3) {
          cardClass += " lg:w-[calc(33.333%-1rem)]";
        }

        return (
          <div key={item.key} className={cardClass}>
            <ChartCard
              title={item.title}
              value={data.now}
              data={data.chartData}
              color={item.color}
              subtitle={onlyVisualDocs && item.subtitle ? item.subtitle : null}
            />
          </div>
        );
      })}
    </div>
  );
}
