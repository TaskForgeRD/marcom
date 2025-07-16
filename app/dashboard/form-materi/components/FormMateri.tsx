"use client";

import { FormProvider } from "react-hook-form";
import ConfirmDialog from "../../uiRama/confirmDialog";
import { useDocumentForm } from "../../../../hooks/useDocumentForm";
import InformasiUmum from "./InformasiUmum";
import DokumenMateri from "./DokumenMateri";
import FormFooter from "./FormFooter";
import { useMateri } from "@/stores/materi.store";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface FormMateriProps {
  mode?: string;
  materiId?: string;
}

export default function FormMateri({ mode }: FormMateriProps) {
  const router = useRouter();
  const { selectedMateri, setSelectedMateri } = useMateri();
  const isViewMode = mode === "view";

  // Reset selectedMateri jika masuk ke mode "tambah"
  useEffect(() => {
    if (!mode) {
      setSelectedMateri(null);
    }
  }, [mode, setSelectedMateri]);

  const {
    methods,
    handleSubmit,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    onSubmit,
  } = useDocumentForm(mode ? (selectedMateri ?? undefined) : undefined);

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const brandValue = methods.watch("cluster");
  console.log("Current brand value:", brandValue);

  return (
    <FormProvider {...methods}>
      <div className="py-6 space-y-1 text-center">
        {isViewMode && (
          <p className="text-sm text-blue-600 font-medium">
            Detail Materi Komunikasi
          </p>
        )}
        {mode === "edit" && (
          <p className="text-sm text-blue-600 font-medium">
            Edit Materi Komunikasi
          </p>
        )}
        <h1 className="text-2xl font-semibold text-foreground">
          {isViewMode || mode === "edit"
            ? (selectedMateri?.nama_materi ?? "-")
            : "Tambah Materi Komunikasi"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(() => setIsDialogOpen(true))}>
        <div className="max-w-2xl mx-auto pl-6 pr-6 pb-6">
          <InformasiUmum readOnly={isViewMode} />
          <DokumenMateri readOnly={isViewMode} />
        </div>

        <FormFooter
          isLoading={isLoading}
          primaryLabel={isViewMode ? "Edit Materi Komunikasi" : "Simpan"}
          onPrimaryClick={() => {
            if (isViewMode) {
              router.push(
                `/dashboard/form-materi/${selectedMateri?.id}?mode=edit`
              );
            }
          }}
          onCancel={handleCancel}
          isViewMode={isViewMode}
        />

        <ConfirmDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleSubmit(onSubmit)}
          title="Konfirmasi Simpan"
          description="Apakah Anda yakin ingin menyimpan dokumen ini?"
          isLoading={isLoading}
        />
      </form>
    </FormProvider>
  );
}
