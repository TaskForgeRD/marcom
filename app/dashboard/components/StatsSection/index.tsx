"use client";

import React from "react";
import { useState } from "react";
import StatsCard from "./components/StatsCard";
import StatsChartCard from "./components/StatsChartCard";
import ToggleControls from "@/app/dashboard/uiRama/toggle-controls";

const StatsSection = () => {
  const [onlyVisualDocs, setOnlyVisualDocs] = useState(false);
  const [showStatsSection, setShowStatsSection] = useState(true);
  return (

    <section>
      {showStatsSection ? <StatsCard /> : <StatsChartCard />}
      <ToggleControls
        label="Lihat data yang ada dokumen visual saja"
        switchState={onlyVisualDocs}
        onToggleSwitch={setOnlyVisualDocs}
        togglePanelState={showStatsSection}
        onTogglePanel={() => setShowStatsSection((prev) => !prev)}
        togglePanelLabel={{
          show: "Sembunyikan Detail Summary",
          hide: "Lihat Detail Summary",
        }}
      />
    </section>
  );
};

export default StatsSection;