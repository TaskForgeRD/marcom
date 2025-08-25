// app/dashboard/components/stats-section/components/stats-chart-card/index.tsx
"use client";

import React from "react";
import { useStatsData } from "@/hooks/useStatsData";
import { ChartCard } from "@/app/dashboard/uiRama/chart/ChartCard";
import { statsConfig } from "@/app/dashboard/components/stats-section/StatsConfig";
import { useFilterStore } from "@/stores/filter-materi.store";

export default function Page() {
  const { stats, loading, error, totalFitur } = useStatsData();
  const { onlyVisualDocs } = useFilterStore();

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-wrap gap-4 px-4 py-4">
        {statsConfig.map((item) => (
          <div key={item.key} className="w-full lg:w-[calc(33.333%-1rem)]">
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
              <p className="text-gray-500">Loading chart...</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-wrap gap-4 px-4 py-4">
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error loading chart data: {error}</p>
        </div>
      </div>
    );
  }

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

        const ID_MONTH = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agust",
          "Sept",
          "Okt",
          "Nov",
          "Des",
        ];

        const chartData = (data.chartData ?? []).map(
          (p: {
            fullMonth?: string;
            month?: string;
            monthName?: string;
            value: number | string;
          }) => {
            // Ambil kode bulan 2 digit kalau ada, fallback ke monthName
            const code = (p.fullMonth ?? p.month ?? "")
              .toString()
              .padStart(2, "0");
            const idx = Number(code) - 1;

            return {
              name: ID_MONTH[idx] ?? p.monthName ?? code, // ← label "Januari", dst.
              value: Number(p.value),
            };
          }
        );

        console.log(chartData);

        // Override title for fitur to indicate API source
        const chartTitle =
          item.key === "fitur" ? `${item.title} (dari API)` : item.title;

        // For fitur, use totalFitur as current value instead of data.now
        const currentValue = item.key === "fitur" ? totalFitur : data.now;

        return (
          <div key={item.key} className={cardClass}>
            <ChartCard
              title={item.title}
              value={currentValue}
              data={chartData}
              color={item.color}
              // Show subtitle only if onlyVisualDocs is active and item has subtitle
              subtitle={onlyVisualDocs && item.subtitle ? item.subtitle : null}
            />
          </div>
        );
      })}
    </div>
  );
}
