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
  return endDate >= todayUTC;
}

export default function useFilteredMateri() {
  const { data } = useMateri();
  const { filters, searchQuery, onlyVisualDocs } = useFilterStore();

  const filteredData = useMemo(() => {
    const now = new Date();
    const todayUTC = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    );

    return data.filter((item) => {
      const { start_date, end_date, status, fitur, brand, cluster, jenis } =
        filters;

      const itemStartDate = item.start_date ? new Date(item.start_date) : null;
      const itemEndDate = item.end_date ? new Date(item.end_date) : null;

      const filterStartDate = start_date ? new Date(start_date) : null;
      const filterEndDate = end_date ? new Date(end_date) : null;

      // Filter berdasarkan range tanggal
      const isInRange =
        (!filterStartDate || (itemEndDate && itemEndDate >= filterStartDate)) &&
        (!filterEndDate || (itemStartDate && itemStartDate <= filterEndDate));

      // Filter berdasarkan status
      const isStatusMatch =
        !status ||
        (status === "Aktif" && item.end_date && isMateriAktif(item.end_date)) ||
        (status === "Expired" &&
          item.end_date &&
          !isMateriAktif(item.end_date));

      // Filter berdasarkan pencarian
      const searchLower = searchQuery.toLowerCase();
      const namaMatch = item.nama_materi.toLowerCase().includes(searchLower);

      const keywordMatch = Array.isArray(item.dokumenMateri)
        ? item.dokumenMateri.some((dokumen) =>
            (dokumen.keywords || []).some((keyword) =>
              keyword.toLowerCase().includes(searchLower)
            )
          )
        : false;

      const matchesSearch = namaMatch || keywordMatch;

      // Filter berdasarkan kategori lainnya
      const isFiturMatch = !fitur || item.fitur === fitur;
      const isBrandMatch = !brand || item.brand === brand;
      const isClusterMatch = !cluster || item.cluster === cluster;
      const isJenisMatch = !jenis || item.jenis === jenis;

      // Filter berdasarkan Key Visual
      const hasKeyVisualDoc = onlyVisualDocs
        ? Array.isArray(item.dokumenMateri) &&
          item.dokumenMateri.some(
            (dokumen) => dokumen.tipeMateri === "Key Visual"
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
