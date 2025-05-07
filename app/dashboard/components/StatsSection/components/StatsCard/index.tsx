import React from "react";
import { useStatsData } from "@/hooks/useStatsData";
import { statsConfig } from "../../StatsConfig";
import Card from "@/app/dashboard/uiRama/card";

const StatsCard = () => {
  const {
    selectedPreset,
    waktuLabel,
    stats: { total, komunikasi, fitur, aktif, expired, dokumen },
  } = useStatsData();

  const statsMap = { total, komunikasi, fitur, aktif, expired, dokumen };

  const hideChangeAndSubtext =
    selectedPreset === "All time" || selectedPreset === "Pilih tanggal tertentu";

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 px-4">
        {statsConfig.map(({ key, title, icon }) => {
          const { now, changeLabel } = statsMap[key];
          return (
            <Card
              key={key}
              title={title}
              value={now.toString()}
              change={changeLabel}
              subtext={waktuLabel}
              icon={icon}
              showChange={!hideChangeAndSubtext}
            />
          );
        })}
      </div>
  );
};

export default StatsCard;