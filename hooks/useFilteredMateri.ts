import { useMemo } from "react";
import { useMateri } from "@/stores/materi.store";
import { useFilterStore } from "../stores/filter-materi.store";

export default function useFilteredMateri() {
  const { data } = useMateri();
  const { filters, searchQuery, onlyVisualDocs } = useFilterStore();

  const filteredData = useMemo(() => {
    // Gunakan waktu Indonesia (WIB) untuk konsistensi
    const today = new Date();
    // Set jam ke 00:00:00 untuk perbandingan yang akurat
    today.setHours(0, 0, 0, 0);

    return data.filter((item) => {
      const { start_date, end_date, status, fitur, brand, cluster, jenis } =
        filters;

      // Konversi tanggal item ke Date object dan set ke 00:00:00
      const itemstart_date = item.start_date ? new Date(item.start_date) : null;
      const itemend_date = item.end_date ? new Date(item.end_date) : null;

      // Set jam ke 00:00:00 untuk perbandingan yang konsisten
      if (itemstart_date) itemstart_date.setHours(0, 0, 0, 0);
      if (itemend_date) itemend_date.setHours(0, 0, 0, 0);

      // Konversi tanggal filter
      const filterstart_date = start_date ? new Date(start_date) : null;
      const filterend_date = end_date ? new Date(end_date) : null;

      if (filterstart_date) filterstart_date.setHours(0, 0, 0, 0);
      if (filterend_date) filterend_date.setHours(0, 0, 0, 0);

      // Filter berdasarkan range tanggal
      const isInRange =
        (!filterstart_date ||
          (itemend_date && itemend_date >= filterstart_date)) &&
        (!filterend_date ||
          (itemstart_date && itemstart_date <= filterend_date));

      // Filter berdasarkan status - PERBAIKAN UTAMA
      const isStatusMatch =
        !status ||
        (status === "Aktif" && itemend_date && itemend_date >= today) ||
        (status === "Expired" && itemend_date && itemend_date < today);

      // Filter berdasarkan pencarian
      const searchLower = searchQuery.toLowerCase();
      const namaMatch = item.nama_materi.toLowerCase().includes(searchLower);

      // Cek keyword
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

      // Filter berdasarkan Key Visual - TAMBAHAN BARU
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
        hasKeyVisualDoc // Tambahkan filter Key Visual
      );
    });
  }, [data, filters, searchQuery, onlyVisualDocs]);

  return filteredData;
}
