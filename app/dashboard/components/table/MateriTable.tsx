"use client";

import { useEffect } from "react";
import { useMateriStore } from "../../../../store/useMateriStore";
import useFilteredMateri from "../../../../hooks/useFilteredMateri";
import { paginate } from "../../../../lib/paginate";
import ListTable from "./ListTable";
import { Progress } from "@/components/ui/progress";

export default function MateriTable() {
  const { loading, currentPage, itemsPerPage, fetchData } = useMateriStore();
  const filteredData = useFilteredMateri();

  console.log(filteredData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { paginatedData, startIndex, endIndex, total } = paginate(filteredData, currentPage, itemsPerPage);

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex flex-col items-center">
          <Progress value={33} className="w-[60%]" />
          <p className="mt-2 text-sm text-gray-600">Memuat data...</p>
        </div>
      ) : (
        <>
          <ListTable title="Daftar Materi Komunikasi" data={paginatedData} />
          <p className="mt-4 text-sm text-gray-600">
            Showing {startIndex + 1}-{endIndex} of {total} products
          </p>
        </>
      )}
    </div>
  );
}
