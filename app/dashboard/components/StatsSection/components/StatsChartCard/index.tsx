'use client';

import React from "react";
import { useStatsData } from "@/hooks/useStatsData";
import { ChartCard } from "@/app/dashboard/uiRama/chart/ChartCard";
import { statsConfig } from "@/app/dashboard/components/StatsSection/StatsConfig"; 

export default function StatsChartCard() {
  const { stats } = useStatsData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsConfig.map((item) => {
          const data = stats[item.key];
          if (!data) return null;

          return (
            <ChartCard
              key={item.key}
              title={item.title}
              value={data.now}
              data={data.chartData}
              color={item.color}
              subtitle={item.subtitle}
            />
          );
        })}
      </div>
    </div>
  );
}
