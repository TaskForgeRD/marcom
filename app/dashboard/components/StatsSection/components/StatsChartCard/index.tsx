'use client';

import React from "react";
import { useStatsData } from "@/hooks/useStatsData";
import { ChartCard } from "@/app/dashboard/uiRama/chart/ChartCard";
import { statsConfig } from "@/app/dashboard/components/StatsSection/StatsConfig"; 

export default function StatsChartCard() {
  const { stats } = useStatsData();

  return (
  <div className="flex flex-wrap gap-4 px-4 py-4">
    {statsConfig.map((item, index) => {
      const data = stats[item.key];
      if (!data) return null;

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
            subtitle={item.subtitle}
          />
        </div>
      );
    })}
  </div>
  );
}
