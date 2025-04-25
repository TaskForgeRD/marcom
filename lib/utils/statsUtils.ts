import dayjs from "dayjs";

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
  const isInRange = (date: string) => {
    if (!dateRange) return true;
    const d = dayjs(date);
    return d.isAfter(dayjs(dateRange.from), "day") && d.isBefore(dayjs(dateRange.to), "day");
  };

  const current = data.filter((d) => isInRange(d.startDate) && filterFn(d));
  const prev = data.filter((d) => {
    if (!dateRange) return false;
    const rangeDays = dayjs(dateRange.to).diff(dayjs(dateRange.from), "day") + 1;
    const prevStart = dayjs(dateRange.from).subtract(rangeDays, "day");
    const prevEnd = dayjs(dateRange.from).subtract(1, "day");
    const dDate = dayjs(d.startDate);
    return dDate.isAfter(prevStart, "day") && dDate.isBefore(prevEnd, "day") && filterFn(d);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const count = (arr: any[]) =>
    uniqueBy ? new Set(arr.map(uniqueBy).filter(Boolean)).size : arr.length;

  return {
    now: count(current),
    change: count(current) - count(prev),
  };
};
