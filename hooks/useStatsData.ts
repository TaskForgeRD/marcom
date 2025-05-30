import { useMemo } from "react";
import { useFilterStore } from "@/store/useFilterStore";
import useFilteredMateri from "@/hooks/useFilteredMateri";
import dayjs from "dayjs";
import { formatPresetLabel } from "@/lib/utils/dateUtils";
import { getFilteredStats, formatChange } from "@/lib/utils/statsUtils";

export const useStatsData = () => {
  const { selectedPreset, filters } = useFilterStore();
  const filteredMateri = useFilteredMateri();

  const dateRange =
    filters?.startDate && filters?.endDate
      ? { from: new Date(filters.startDate), to: new Date(filters.endDate) }
      : undefined;

  const waktuLabel = formatPresetLabel(selectedPreset, dateRange);

  const getMonthlyChartData = (filterFn: (m: any) => boolean) => {
    const months = Array.from({ length: 12 }).map((_, idx) => {
      const month = dayjs().month(idx);
      const itemsInMonth = filteredMateri.filter(
        (m) =>
          dayjs(m.startDate).month() === idx &&
          filterFn(m)
      );

      return {
        name: month.format("MMM"),
        value: itemsInMonth.length,
      };
    });

    return months;
  };

  const stats = useMemo(() => {
    return {
      total: getFilteredStats(filteredMateri, () => true, dateRange),
      fitur: {
        ...getFilteredStats(filteredMateri, (m) => m.fitur, dateRange, (m) =>
          m.fitur?.trim().toLowerCase()
        ),
        chartData: getMonthlyChartData((m) => m.fitur),
      },
      komunikasi: {
        ...getFilteredStats(filteredMateri, (m) => m.namaMateri, dateRange),
        chartData: getMonthlyChartData((m) => m.namaMateri),
      },
      aktif: {
        ...getFilteredStats(filteredMateri, (m) => dayjs().isBefore(m.endDate), dateRange),
        chartData: getMonthlyChartData((m) => dayjs().isBefore(m.endDate)),
      },
      expired: {
        ...getFilteredStats(filteredMateri, (m) => dayjs().isAfter(m.endDate), dateRange),
        chartData: getMonthlyChartData((m) => dayjs().isAfter(m.endDate)),
      },
      dokumen: {
        ...getFilteredStats(filteredMateri, (m) => m.dokumenMateri?.length > 0, dateRange),
        chartData: getMonthlyChartData((m) => m.dokumenMateri?.length > 0),
      },
    };
  }, [filteredMateri, dateRange]);

  return {
    selectedPreset,
    waktuLabel,
    stats: Object.fromEntries(
      Object.entries(stats).map(([key, val]) => [
        key,
        {
          ...val,
          changeLabel: formatChange(val.change),
        },
      ])
    ) as Record<
      string,
      typeof stats.total & { changeLabel: string; chartData: { name: string; value: number }[] }
    >,
  };
};
