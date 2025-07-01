import { useMemo } from "react";
import { useMateri } from "@/stores/materi.store";
import { useFilterStore } from "../stores/filter-materi.store";

export default function useFilteredMateri() {
  const { data } = useMateri();
  const { filters, searchQuery } = useFilterStore();

  const filteredData = useMemo(() => {
    const today = new Date();

    return data.filter((item) => {
      const { start_date, end_date, status, fitur, brand, cluster, jenis } = filters;
    
      const itemstart_date = item.start_date ? new Date(item.start_date) : null;
      const itemend_date = item.end_date ? new Date(item.start_date) : null;
    
      const filterstart_date = start_date ? new Date(start_date) : null;
      const filterend_date = end_date ? new Date(end_date) : null;
    
      const isInRange =
        (!filterstart_date || (itemend_date && itemend_date >= filterstart_date)) &&
        (!filterend_date || (itemstart_date && itemstart_date <= filterend_date));
    
      const isStatusMatch =
        !status ||
        (status === "Aktif" && itemend_date && itemend_date >= today) ||
        (status === "Expired" && itemend_date && itemend_date < today);
    
      const matchesSearch = item.nama_materi
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    
      const isFiturMatch = !fitur || item.fitur === fitur;
      const isBrandMatch = !brand || item.brand === brand;
      const isClusterMatch = !cluster || item.cluster === cluster;
      const isjenisMatch = !jenis || item.jenis === jenis;
    
      return (
        isInRange &&
        isStatusMatch &&
        matchesSearch &&
        isFiturMatch &&
        isBrandMatch &&
        isClusterMatch &&
        isjenisMatch
      );
    });
  }, [data, filters, searchQuery]);

  return filteredData;
}
