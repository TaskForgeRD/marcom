"use client";

import React from "react";
import { useSocket } from "@/hooks/useSocket";
import { ChartCard } from "@/app/dashboard/uiRama/chart/ChartCard";
import { statsConfig } from "@/app/dashboard/components/stats-section/StatsConfig";
import { useFilterStore } from "@/stores/filter-materi.store";

export default function StatsChartCard() {
  const { stats } = useSocket();
  const { onlyVisualDocs } = useFilterStore();

  const getStatsData = (key: string) => {
    const currentValue = (stats?.[key as keyof typeof stats] as number) || 0;

    const chartData =
      stats?.monthlyData?.[key as keyof typeof stats.monthlyData] || [];

    return {
      now: currentValue,
      chartData: chartData,
    };
  };

  console.log("Stats data:", stats);

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
