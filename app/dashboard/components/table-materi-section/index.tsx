"use client";

import { useEffect, useRef } from "react";
import { useMateri } from "@/stores/materi.store";
import { useAuthStore } from "@/stores/auth.store";
import { useFilterStore } from "@/stores/filter-materi.store";
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
    currentPage,
    totalPages,
    total,
    itemsPerPage,
    fetchPaginatedData,
    setCurrentPage,
    setSelectedMateri,
  } = useMateri();

  const { user } = useAuthStore();
  const { filters, searchQuery, onlyVisualDocs } = useFilterStore();
  const tableRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const currentUserRole = user?.role;
  const start = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);

  useEffect(() => {
    const apiFilters = {
      search: searchQuery,
      status: filters.status || "",
      brand: filters.brand || "",
      cluster: filters.cluster || "",
      fitur: filters.fitur || "",
      jenis: filters.jenis || "",
      start_date: filters.start_date || "",
      end_date: filters.end_date || "",
      only_visual_docs: onlyVisualDocs.toString(),
    };

    fetchPaginatedData(1, apiFilters); // Reset to page 1 when filters change
  }, [filters, searchQuery, onlyVisualDocs, fetchPaginatedData]);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);

    const apiFilters = {
      search: searchQuery,
      status: filters.status || "",
      brand: filters.brand || "",
      cluster: filters.cluster || "",
      fitur: filters.fitur || "",
      jenis: filters.jenis || "",
      start_date: filters.start_date || "",
      end_date: filters.end_date || "",
      only_visual_docs: onlyVisualDocs.toString(),
    };

    fetchPaginatedData(page, apiFilters);

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

  const canAddMateri =
    currentUserRole !== undefined && currentUserRole !== "guest";

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="p-4 overflow-x-auto" ref={tableRef}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Daftar Materi Komunikasi</h2>
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
                colSpan={10}
                className="text-center text-gray-500 py-4"
              >
                Tidak ada data yang cocok dengan filter
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {start}-{end} dari {total} data
        </p>

        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageClick(currentPage + 1)}
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
