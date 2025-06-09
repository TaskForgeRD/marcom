import { useEffect } from "react";
import { useMultiApiStore } from "@/stores/APIStore";

export function useInformasiUmumOptions() {
  const {
    jenis,
    fitur,
    brands,
    clusters,
    fetchAllData,
  } = useMultiApiStore();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const toOptions = (data: any[]) =>
    data.map(item => ({
      value: item.name,
      label: item.name,
    }));

  return {
    jenisOptions: toOptions(jenis),
    fiturOptions: toOptions(fitur),
    brandOptions: toOptions(brands),
    clusterOptions: toOptions(clusters),
  };
}
