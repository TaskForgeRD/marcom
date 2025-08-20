import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const formatChange = (change: number): string =>
  change === 0 ? "0" : change > 0 ? `+${change}` : `${change}`;

export const getFilteredStats = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterFn: (item: any) => boolean,
  dateRange?: { from: Date; to: Date },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uniqueBy?: (item: any) => string | undefined
) => {
  // Perbaikan logika untuk menentukan apakah materi berada dalam rentang tanggal
  const isInDateRange = (item: any) => {
    if (!dateRange) return true;

    const startDate = item.start_date ? dayjs(item.start_date) : null;
    const endDate = item.end_date ? dayjs(item.end_date) : null;
    const rangeStart = dayjs(dateRange.from);
    const rangeEnd = dayjs(dateRange.to);

    // Materi dianggap dalam range jika:
    // 1. start_date <= rangeEnd DAN end_date >= rangeStart
    // Atau dengan kata lain, ada overlap antara periode materi dengan range filter

    if (!startDate && !endDate) return false;
    if (!startDate) return endDate && endDate.isSameOrAfter(rangeStart, "day");
    if (!endDate) return startDate.isSameOrBefore(rangeEnd, "day");

    // Ada overlap jika start_date <= rangeEnd DAN end_date >= rangeStart
    return (
      startDate.isSameOrBefore(rangeEnd, "day") &&
      endDate.isSameOrAfter(rangeStart, "day")
    );
  };

  const current = data.filter((d) => isInDateRange(d) && filterFn(d));

  const prev = data.filter((d) => {
    if (!dateRange) return false;

    const rangeDays =
      dayjs(dateRange.to).diff(dayjs(dateRange.from), "day") + 1;
    const prevRangeStart = dayjs(dateRange.from).subtract(rangeDays, "day");
    const prevRangeEnd = dayjs(dateRange.from).subtract(1, "day");

    const startDate = d.start_date ? dayjs(d.start_date) : null;
    const endDate = d.end_date ? dayjs(d.end_date) : null;

    if (!startDate && !endDate) return false;
    if (!startDate)
      return endDate && endDate.isSameOrAfter(prevRangeStart, "day");
    if (!endDate) return startDate.isSameOrBefore(prevRangeEnd, "day");

    // Ada overlap dengan periode sebelumnya
    return (
      startDate.isSameOrBefore(prevRangeEnd, "day") &&
      endDate.isSameOrAfter(prevRangeStart, "day") &&
      filterFn(d)
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const count = (arr: any[]) =>
    uniqueBy ? new Set(arr.map(uniqueBy).filter(Boolean)).size : arr.length;

  return {
    now: count(current),
    change: count(current) - count(prev),
  };
};
