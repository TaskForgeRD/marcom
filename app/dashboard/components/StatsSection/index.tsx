import React from "react";
import StatsCard from "./components/StatsCard";
import StatsChartCard from "./components/StatsChartCard";

const StatsSection = () => {
  return (
    <section>
      <StatsCard />
      <StatsChartCard />
    </section>
  );
};

export default StatsSection;