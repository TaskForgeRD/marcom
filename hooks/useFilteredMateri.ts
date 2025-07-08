import { useMemo } from "react";
import { useMateri } from "@/stores/materi.store";
import { useFilterStore } from "../stores/filter-materi.store";

export default function useFilteredMateri() {
  const { data } = useMateri();
  const { filters, searchQuery, onlyVisualDocs } = useFilterStore();

  const filteredData = useMemo(() => {
    // Buat 'today' dalam UTC jam 00:00:00 untuk konsistensi
    const now = new Date();
    const todayUTC = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    );

    return data.filter((item) => {
      const { start_date, end_date, status, fitur, brand, cluster, jenis } =
        filters;

      // Konversi string ISO jadi Date object
      const itemstart_date = item.start_date ? new Date(item.start_date) : null;
      const itemend_date = item.end_date ? new Date(item.end_date) : null;

      // Filter berdasarkan range tanggal
      const filterstart_date = start_date ? new Date(start_date) : null;
      const filterend_date = end_date ? new Date(end_date) : null;

      const isInRange =
        (!filterstart_date ||
          (itemend_date && itemend_date >= filterstart_date)) &&
        (!filterend_date ||
          (itemstart_date && itemstart_date <= filterend_date));

      // Filter berdasarkan status
      const isStatusMatch =
        !status ||
        (status === "Aktif" && itemend_date && itemend_date >= todayUTC) ||
        (status === "Expired" && itemend_date && itemend_date < todayUTC);

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
      const isjenisMatch = !jenis || item.jenis === jenis;

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
        isjenisMatch &&
        hasKeyVisualDoc
      );
    });
  }, [data, filters, searchQuery, onlyVisualDocs]);

  return filteredData;
}
