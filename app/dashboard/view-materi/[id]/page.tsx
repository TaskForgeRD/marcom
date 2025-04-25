"use client";

import { useParams } from "next/navigation";
import { useMateriStore } from "@/store/useMateriStore";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Key } from "react";

import FormFooter from "@/app/dashboard/form-materi/components/FormFooter";

export default function ViewMateri() {
  const { id } = useParams();
  const selectedMateri = useMateriStore((state) => state.selectedMateri);
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dokumenMateri = (selectedMateri as any)?.dokumenMateri || [];

  if (!id) return <p className="text-center p-6">Memuat data materi...</p>;
  if (!selectedMateri) return <p className="text-center p-6">Materi tidak ditemukan...</p>;

  return (
    <div>
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-1">
      <h2 className="text-sm font-semibold text-[#0078D4]">Detail Materi Komuniasi</h2>
      <h1 className="text-2xl font-semibold">{selectedMateri.namaMateri}</h1>
      </div>

      {/* Informasi Umum dalam Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Informasi Umum</h3>

          <Field label="Brand" value={selectedMateri.brand} />
          <Field label="Cluster" value={selectedMateri.cluster} />
          <Field label="Fitur" value={selectedMateri.fitur} />
          <Field label="Nama Materi Komunikasi" value={selectedMateri.namaMateri} />
          <Field label="Jenis" value={selectedMateri.jenis} />
          <Field label="Pilih Tanggal Mulai" value={formatDate(selectedMateri.startDate)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Periode" value={getPeriode(selectedMateri.startDate, selectedMateri.endDate)} />
            <Field label="Pilih Tanggal Berakhir" value={formatDate(selectedMateri.endDate)} />
          </div>
        </CardContent>
      </Card>

      {/* Dokumen Materi */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Dokumen Materi</h2>
        {dokumenMateri.map((dokumen: {
          _id: Key | null;
          tipeMateri: string;
          linkDokumen: string;
          thumbnail: string;
          keywords: string[];
        }, index: number) => (
          <Card key={dokumen._id}>
            <CardContent className="p-6 space-y-4">
              <Field label={`Tipe Materi #${index + 1}`} value={dokumen.tipeMateri} />
              <Field label="Link Dokumen" value={dokumen.linkDokumen} isLink />
              {dokumen.thumbnail && (
                <div>
                  <p className="text-sm text-gray-600">Thumbnail</p>
                  <Image
                    src={getImageUrl(dokumen.thumbnail)}
                    alt={`Thumbnail ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dokumen.keywords.map((keyword, idx) => (
                  <Field key={idx} label={`Keyword ${idx + 1}`} value={keyword} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>




    </div>
          <FormFooter
          onCancel={() => (window.location.href = "/materi")}
          onPrimaryClick={() => (window.location.href = `/materi/edit/${id}`)}
          primaryLabel="Edit Materi Komunikasi"
        />
        </div>
  );
}

function Field({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value?: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <div className="bg-gray-100 text-sm px-4 py-2 rounded-md break-words">
        {isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {value}
          </a>
        ) : (
          <span>{value || "-"}</span>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getPeriode(startDateStr: string, endDateStr: string) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  const totalMonths = years * 12 + months;
  return totalMonths >= 12 ? "1 tahun" : `${totalMonths} bulan`;
}
