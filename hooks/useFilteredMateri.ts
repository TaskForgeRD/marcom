import { useMemo } from "react";
import { useMateriStore } from "../store/useMateriStore";
import { useFilterStore } from "../store/useFilterStore";

export default function useFilteredMateri() {
  const { data } = useMateriStore();
  const { filters, searchQuery } = useFilterStore();

  const filteredData = useMemo(() => {
    const today = new Date();

    return data.filter((item) => {
      console.log(item)
      const { startDate, endDate, status, fitur, brand, cluster, tipe } = filters;
    
      const itemStartDate = item.start_date ? new Date(item.start_date) : null;
      const itemEndDate = item.end_date ? new Date(item.end_date) : null;
    
      const filterStartDate = startDate ? new Date(startDate) : null;
      const filterEndDate = endDate ? new Date(endDate) : null;
    
      const isInRange =
        (!filterStartDate || (itemEndDate && itemEndDate >= filterStartDate)) &&
        (!filterEndDate || (itemStartDate && itemStartDate <= filterEndDate));
    
      const isStatusMatch =
        !status ||
        (status === "Aktif" && itemEndDate && itemEndDate >= today) ||
        (status === "Expired" && itemEndDate && itemEndDate < today);
    
      const matchesSearch = item.nama_materi
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    
      const isFiturMatch = !fitur || item.fitur === fitur;
      const isBrandMatch = !brand || item.brand_name === brand;
      const isClusterMatch = !cluster || item.cluster_name === cluster;
      const isTipeMatch = !tipe || item.jenis === tipe;
    
      return (
        isInRange &&
        isStatusMatch &&
        matchesSearch &&
        isFiturMatch &&
        isBrandMatch &&
        isClusterMatch &&
        isTipeMatch
      );
    });
  }, [data, filters, searchQuery]);

  return filteredData;
}
