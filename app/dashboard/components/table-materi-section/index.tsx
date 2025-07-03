"use client";

import { useEffect, useRef } from "react";
import { useMateri } from "@/stores/materi.store";
import useFilteredMateri from "@/hooks/useFilteredMateri";
import { paginate } from "@/lib/paginate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { materiTableColumns } from "@/app/dashboard/components/table-materi-section/TableColumnConfig";
import LoadingSpinner from "@/app/dashboard/components/table-materi-section/components/LoadingSpinner";
import MateriRow from "@/app/dashboard/components/table-materi-section/components/MateriRow";

export default function TableMateriSection() {
  const { loading, currentPage, itemsPerPage, fetchData, setCurrentPage } =
    useMateri();
  const filteredData = useFilteredMateri();
  const tableRef = useRef<HTMLDivElement>(null);

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

  const { paginatedData, startIndex, endIndex, total } = paginate(
    sortedData,
    currentPage,
    itemsPerPage
  );

  // Hitung total halaman
  const totalPages = Math.ceil(total / itemsPerPage);

  // Handler untuk navigasi
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // Maintain scroll position
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({
            behavior: "instant",
            block: "start",
          });
        }
      }, 50);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Maintain scroll position
      setTimeout(() => {
        if (tableRef.current) {
          tableRef.current.scrollIntoView({
            behavior: "instant",
            block: "start",
          });
        }
      }, 50);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    // Maintain scroll position
    setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      }
    }, 50);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="p-4 overflow-x-auto" ref={tableRef}>
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
            paginatedData.map((materi) => (
              <MateriRow key={materi.id} materi={materi} />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-gray-500 py-4"
              >
                Tidak ada data yang cocok dengan filter
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Info */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {startIndex + 1}-{endIndex} dari {total} materi
        </p>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
