"use client";

import { useEffect } from "react";
import { useMateriStore } from "@/store/useMateriStore";
import useFilteredMateri from "@/hooks/useFilteredMateri";
import { paginate } from "@/lib/paginate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { materiTableColumns } from "@/app/dashboard/components/table-materi-section/TableColumnConfig";
import LoadingSpinner from "@/app/dashboard/components/table-materi-section/components/LoadingSpinner";
import MateriRow from "@/app/dashboard/components/table-materi-section/components/MateriRow";

export default function TableMateriSection() {
  const { loading, currentPage, itemsPerPage, fetchData } = useMateriStore();
  const filteredData = useFilteredMateri();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { paginatedData, startIndex, endIndex, total } = paginate(filteredData, currentPage, itemsPerPage);

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <section className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">Daftar Materi Komunikasi</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {materiTableColumns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((materi) => <MateriRow key={materi._id} materi={materi} />)
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-gray-500 py-4">
                Tidak ada data yang cocok dengan filter
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <p className="mt-4 text-sm text-gray-600">
        Menampilkan {startIndex + 1}-{endIndex} dari {total} materi
      </p>
    </section>
  );
}
