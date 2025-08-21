import { useMemo } from "react";
import { useMateri } from "@/stores/materi.store";
import { useFilterStore } from "../stores/filter-materi.store";

// Fungsi helper: cek apakah materi masih aktif berdasarkan end_date UTC
function isMateriAktif(itemEndDate: string | null): boolean {
  if (!itemEndDate) return false;

  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  );

  const endDate = new Date(itemEndDate);
  // Ubah dari >= menjadi >
  return endDate > todayUTC;
}

export default function useFilteredMateri() {
  const { data } = useMateri();
  const { filters, searchQuery, onlyVisualDocs } = useFilterStore();

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const { start_date, end_date, status, fitur, brand, cluster, jenis } =
        filters;

      // === FILTER BERDASARKAN RANGE TANGGAL ===
      let isInRange = true;

      if (start_date && end_date) {
        const filterStartDate = new Date(start_date);
        const filterEndDate = new Date(end_date);

        const itemStartDate = item.start_date
          ? new Date(item.start_date)
          : null;
        const itemEndDate = item.end_date ? new Date(item.end_date) : null;

        // Materi masuk dalam range jika ada overlap antara:
        // [item.start_date, item.end_date] dengan [filter.start_date, filter.end_date]

        if (itemStartDate && itemEndDate) {
          // Ada overlap jika: item_start <= filter_end DAN item_end >= filter_start
          isInRange =
            itemStartDate <= filterEndDate && itemEndDate >= filterStartDate;
        } else if (itemStartDate && !itemEndDate) {
          // Jika tidak ada end_date, cek apakah start_date dalam range
          isInRange =
            itemStartDate >= filterStartDate && itemStartDate <= filterEndDate;
        } else if (!itemStartDate && itemEndDate) {
          // Jika tidak ada start_date, cek apakah end_date dalam range
          isInRange =
            itemEndDate >= filterStartDate && itemEndDate <= filterEndDate;
        } else {
          // Jika tidak ada start_date dan end_date
          isInRange = false;
        }
      }

      // === FILTER BERDASARKAN STATUS ===
      const isStatusMatch =
        !status ||
        (status === "Aktif" && item.end_date && isMateriAktif(item.end_date)) ||
        (status === "Expired" &&
          item.end_date &&
          !isMateriAktif(item.end_date));

      // === FILTER BERDASARKAN PENCARIAN ===
      const searchLower = searchQuery.toLowerCase();
      const namaMatch = item.nama_materi.toLowerCase().includes(searchLower);

      const keywordMatch = Array.isArray(item.dokumenMateri)
        ? item.dokumenMateri.some((dokumen: { keywords: any }) =>
            (dokumen.keywords || []).some((keyword: string) =>
              keyword.toLowerCase().includes(searchLower)
            )
          )
        : false;

      const matchesSearch = namaMatch || keywordMatch;

      // === FILTER BERDASARKAN KATEGORI LAINNYA ===
      const isFiturMatch = !fitur || item.fitur === fitur;
      const isBrandMatch = !brand || item.brand === brand;
      const isClusterMatch = !cluster || item.cluster === cluster;
      const isJenisMatch = !jenis || item.jenis === jenis;

      // === FILTER BERDASARKAN KEY VISUAL ===
      const hasKeyVisualDoc = onlyVisualDocs
        ? Array.isArray(item.dokumenMateri) &&
          item.dokumenMateri.some(
            (dokumen: { tipeMateri: string }) =>
              dokumen.tipeMateri === "Key Visual"
          )
        : true;

      return (
        isInRange &&
        isStatusMatch &&
        matchesSearch &&
        isFiturMatch &&
        isBrandMatch &&
        isClusterMatch &&
        isJenisMatch &&
        hasKeyVisualDoc
      );
    });
  }, [data, filters, searchQuery, onlyVisualDocs]);

  return filteredData;
}
