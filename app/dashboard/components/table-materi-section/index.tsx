"use client";

import { useEffect } from "react";
import { useMateri } from "@/stores/materi.store";
import useFilteredMateri from "@/hooks/useFilteredMateri";
import { paginate } from "@/lib/paginate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { materiTableColumns } from "@/app/dashboard/components/table-materi-section/TableColumnConfig";
import LoadingSpinner from "@/app/dashboard/components/table-materi-section/components/LoadingSpinner";
import MateriRow from "@/app/dashboard/components/table-materi-section/components/MateriRow";

export default function TableMateriSection() {
  const { loading, currentPage, itemsPerPage, fetchData } = useMateri();
  const filteredData = useFilteredMateri();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sort data berdasarkan created_at atau updated_at (terbaru di atas)
  const sortedData = [...filteredData].sort((a, b) => {
    // Gunakan updated_at jika ada, jika tidak gunakan created_at
    const dateA = new Date(a.updated_at || a.created_at);
    const dateB = new Date(b.updated_at || b.created_at);
    return dateB.getTime() - dateA.getTime(); // Descending order (terbaru di atas)
  });

  const { paginatedData, startIndex, endIndex, total } = paginate(sortedData, currentPage, itemsPerPage);

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
            paginatedData.map((materi) => <MateriRow key={materi.id} materi={materi} />)
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