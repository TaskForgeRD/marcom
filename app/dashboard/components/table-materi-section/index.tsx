"use client";

import { useEffect, useRef } from "react";
import { useMateri } from "@/stores/materi.store";
import { useFilterStore } from "@/stores/filter-materi.store";
import { useAuthStore } from "@/stores/auth.store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { materiTableColumns } from "@/app/dashboard/components/table-materi-section/TableColumnConfig";
import LoadingSpinner from "@/app/dashboard/components/table-materi-section/components/LoadingSpinner";
import MateriRow from "@/app/dashboard/components/table-materi-section/components/MateriRow";
import { useRouter } from "next/navigation";

export default function TableMateriSection() {
  const {
    data,
    loading,
    pagination,
    fetchData,
    setCurrentPage,
    setSelectedMateri,
  } = useMateri();

  const { filters, getCurrentFilters } = useFilterStore();
  const { user } = useAuthStore();
  const currentUserRole = user?.role;

  const tableRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Initial data fetch
  useEffect(() => {
    const currentFilters = getCurrentFilters();
    fetchData(1, currentFilters);
  }, [fetchData, getCurrentFilters]);

  // Fetch data when filters change
  useEffect(() => {
    const currentFilters = getCurrentFilters();
    fetchData(1, currentFilters); // Reset to page 1 when filters change
  }, [filters, fetchData, getCurrentFilters]);

  // Pagination handlers
  const handlePreviousPage = async () => {
    if (pagination.hasPrevPage) {
      const newPage = pagination.currentPage - 1;
      setCurrentPage(newPage);
      const currentFilters = getCurrentFilters();
      await fetchData(newPage, currentFilters);

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

  const handleNextPage = async () => {
    if (pagination.hasNextPage) {
      const newPage = pagination.currentPage + 1;
      setCurrentPage(newPage);
      const currentFilters = getCurrentFilters();
      await fetchData(newPage, currentFilters);

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

  const handlePageClick = async (page: number) => {
    setCurrentPage(page);
    const currentFilters = getCurrentFilters();
    await fetchData(page, currentFilters);

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

  const handleTambahMateri = () => {
    setSelectedMateri(null);
    router.push("/dashboard/form-materi");
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Check if user can add materi (not guest)
  const canAddMateri =
    currentUserRole !== undefined && currentUserRole !== "guest";

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="p-4 overflow-x-auto" ref={tableRef}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Daftar Materi Komunikasi</h2>
        </div>
        {canAddMateri && (
          <Button
            onClick={handleTambahMateri}
            className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah Materi Komunikasi
          </Button>
        )}
      </div>

      {/* Data Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {materiTableColumns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((materi) => <MateriRow key={materi.id} materi={materi} />)
          ) : (
            <TableRow>
              <TableCell
                colSpan={materiTableColumns.length}
                className="text-center text-gray-500 py-8"
              >
                {loading
                  ? "Memuat data..."
                  : "Tidak ada data yang cocok dengan filter"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Info and Controls */}
      {pagination.totalItems > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Pagination Info */}
          <div className="text-sm text-gray-600">
            Menampilkan {pagination.startIndex}-{pagination.endIndex} dari{" "}
            {pagination.totalItems} materi
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={!pagination.hasPrevPage || loading}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {/* First page if not visible */}
                {getPageNumbers()[0] > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageClick(1)}
                      disabled={loading}
                      className="min-w-[40px]"
                    >
                      1
                    </Button>
                    {getPageNumbers()[0] > 2 && (
                      <span className="text-gray-400 px-2">...</span>
                    )}
                  </>
                )}

                {/* Visible page numbers */}
                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={
                      pagination.currentPage === page ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageClick(page)}
                    disabled={loading}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}

                {/* Last page if not visible */}
                {getPageNumbers()[getPageNumbers().length - 1] <
                  pagination.totalPages && (
                  <>
                    {getPageNumbers()[getPageNumbers().length - 1] <
                      pagination.totalPages - 1 && (
                      <span className="text-gray-400 px-2">...</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageClick(pagination.totalPages)}
                      disabled={loading}
                      className="min-w-[40px]"
                    >
                      {pagination.totalPages}
                    </Button>
                  </>
                )}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage || loading}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
