// hooks/useStatsData.ts - Fixed to use consistent filtering
import { useMemo } from "react";
import { useFilterStore } from "@/stores/filter-materi.store";
import useFilteredMateri from "@/hooks/useFilteredMateri";
import { useSocket } from "@/hooks/useSocket";
import dayjs from "dayjs";
import { formatPresetLabel } from "@/lib/utils/dateUtils";
import { formatChange } from "@/lib/utils/statsUtils";

// Helper function untuk cek status aktif (sama dengan useFilteredMateri)
function isMateriAktif(itemEndDate: string | null): boolean {
  if (!itemEndDate) return false;

  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  );

  const endDate = new Date(itemEndDate);
  return endDate > todayUTC;
}

export const useStatsData = () => {
  const { selectedPreset, filters, applyFilters, setTempFilter } =
    useFilterStore();
  const filteredMateri = useFilteredMateri();
  const {
    stats: socketStats,
    loading: socketLoading,
    error: socketError,
    refreshStats,
  } = useSocket();

  const dateRange =
    filters?.start_date && filters?.end_date
      ? {
          from: new Date(filters.start_date),
          to: new Date(filters.end_date),
        }
      : undefined;

  const waktuLabel = formatPresetLabel(selectedPreset, dateRange);

  const getMonthlyChartData = (filterFn: (m: any) => boolean) => {
    const months = Array.from({ length: 12 }).map((_, idx) => {
      const month = dayjs().month(idx);
      const itemsInMonth = filteredMateri.filter(
        (m: {
          start_date: string | number | Date | dayjs.Dayjs | null | undefined;
        }) => dayjs(m.start_date).month() === idx && filterFn(m)
      );
      return {
        name: month.format("MMM"),
        value: itemsInMonth.length,
      };
    });
    return months;
  };

  const stats = useMemo(() => {
    // Gunakan filteredMateri yang sudah difilter secara konsisten
    // Hitung stats berdasarkan data yang sudah difilter

    const totalCount = filteredMateri.length;

    // Untuk fitur, hitung unique fitur
    const uniqueFitur = new Set(
      filteredMateri.map((m) => m.fitur?.trim().toLowerCase()).filter(Boolean)
    ).size;

    // Komunikasi = total materi
    const komunikasiCount = totalCount;

    // Aktif: materi dengan end_date > hari ini
    const aktifCount = filteredMateri.filter(
      (m) => m.end_date && isMateriAktif(m.end_date)
    ).length;

    // Expired: materi dengan end_date <= hari ini
    const expiredCount = filteredMateri.filter(
      (m) => m.end_date && !isMateriAktif(m.end_date)
    ).length;

    // Dokumen: total dokumen dari semua materi
    const dokumenCount = filteredMateri.reduce((total, m) => {
      return total + (m.dokumenMateri ? m.dokumenMateri.length : 0);
    }, 0);

    // Untuk change calculation, kita perlu membandingkan dengan periode sebelumnya
    // Untuk saat ini, set change ke 0 karena kita tidak memiliki data historis
    const baseStats = {
      total: { now: totalCount, change: 0 },
      fitur: { now: uniqueFitur, change: 0 },
      komunikasi: { now: komunikasiCount, change: 0 },
      aktif: { now: aktifCount, change: 0 },
      expired: { now: expiredCount, change: 0 },
      dokumen: { now: dokumenCount, change: 0 },
    };

    // Add chart data
    return {
      total: {
        ...baseStats.total,
        chartData: getMonthlyChartData(() => true),
      },
      fitur: {
        ...baseStats.fitur,
        chartData: getMonthlyChartData((m) => Boolean(m.fitur)),
      },
      komunikasi: {
        ...baseStats.komunikasi,
        chartData: getMonthlyChartData((m) => Boolean(m.nama_materi)),
      },
      aktif: {
        ...baseStats.aktif,
        chartData: getMonthlyChartData(
          (m) => m.end_date && isMateriAktif(m.end_date)
        ),
      },
      expired: {
        ...baseStats.expired,
        chartData: getMonthlyChartData(
          (m) => m.end_date && !isMateriAktif(m.end_date)
        ),
      },
      dokumen: {
        ...baseStats.dokumen,
        chartData: getMonthlyChartData(
          (m) => m.dokumenMateri && m.dokumenMateri.length > 0
        ),
      },
    };
  }, [filteredMateri]);

  return {
    selectedPreset,
    waktuLabel,
    loading: socketLoading,
    error: socketError,
    applyFilters,
    setTempFilter,
    filters,
    lastUpdated: socketStats?.lastUpdated,
    refreshStats,
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
      typeof stats.total & {
        changeLabel: string;
        chartData: { name: string; value: number }[];
      }
    >,
  };
};
