"use client"

import { FormProvider } from "react-hook-form";
import ConfirmDialog from "../../uiRama/confirmDialog";
import { useDocumentForm } from "../../../../hooks/useDocumentForm";
import InformasiUmum from "./InformasiUmum";
import DokumenMateri from "./DokumenMateri";
import FormFooter from "./FormFooter";
import { useMateriStore } from "@/store/useMateriStore";

import { useRouter } from "next/navigation";

interface FormMateriProps {
  mode?: string;
}

export default function FormMateri({ mode }: FormMateriProps) {
  const router = useRouter();
  const selectedMateri = useMateriStore((state) => state.selectedMateri);
  const isViewMode = mode === "view";

  const {
    methods,
    handleSubmit,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    onSubmit
  } = useDocumentForm(selectedMateri ?? undefined);

  const handleCancel = () => {
    router.push("/dashboard");
  };

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
          {(isViewMode || mode === "edit")
            ? selectedMateri?.namaMateri ?? "-"
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
              router.push(`/dashboard/form-materi/${selectedMateri?.id}?mode=edit`);
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