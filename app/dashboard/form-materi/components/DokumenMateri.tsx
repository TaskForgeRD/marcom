import { useFieldArray, useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import SelectField from "../../uiRama/selectField";
import InputField from "../../uiRama/inputField";
import UploadThumbnail from "./UploadThumbnail";
import { KeywordsInput } from "./KeywordsInput";
import { Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useMateri } from "@/stores/materi.store";
import { Button } from "@/components/ui/button";

interface DokumenMateriProps {
  readOnly?: boolean;
}

function isMateriActive(endDate?: string): boolean {
  if (!endDate) return false;
  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  );
  const end = new Date(endDate);
  return end > todayUTC;
}

export default function DokumenMateri({ readOnly = true }: DokumenMateriProps) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dokumenMateri",
  });

  const { user } = useAuthStore();
  const currentUserRole = user?.role;

  const { selectedMateri } = useMateri();

  const formEndDate = watch("end_date");
  const materiEndDate = formEndDate || selectedMateri?.end_date;

  const isActive = isMateriActive(materiEndDate);

  const addDokumen = () => {
    append({
      linkDokumen: "",
      tipeMateri: "",
      thumbnail: undefined,
      keywords: [""],
    });
  };

  const shouldHideLinkDokumen = () => {
    if (currentUserRole === "superadmin") return false;
    if (currentUserRole === "admin" || currentUserRole === "guest") {
      return !isActive;
    }
    return true;
  };

  const shouldBlurLinkForAdmin = () => {
    return currentUserRole === "admin" && !readOnly;
  };

  const hideLinkDokumen = shouldHideLinkDokumen();
  const blurLinkForAdmin = shouldBlurLinkForAdmin();

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardContent className="p-6 space-y-4 relative">
            <h3 className="text-lg font-semibold">
              Dokumen Materi {index + 1}
            </h3>

            <div
              className={
                (readOnly && hideLinkDokumen) || blurLinkForAdmin
                  ? "blur-sm pointer-events-none"
                  : ""
              }
            >
              <InputField
                name={`dokumenMateri.${index}.linkDokumen`}
                label="Input Link Dokumen Materi"
                placeholder={
                  readOnly && hideLinkDokumen
                    ? "Link tersembunyi - materi sudah expired"
                    : blurLinkForAdmin
                      ? "Link tidak dapat diubah oleh admin"
                      : "Masukkan link dokumen"
                }
                type="url"
                readOnly={readOnly || blurLinkForAdmin}
              />
            </div>

            {blurLinkForAdmin && (
              <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                ℹ️ Link dokumen tidak dapat diubah oleh admin. Nilai asli akan
                tetap digunakan.
              </p>
            )}

            <SelectField
              name={`dokumenMateri.${index}.tipeMateri`}
              label="Tipe Materi"
              options={[
                { value: "Key Visual", label: "Key Visual" },
                { value: "TVC", label: "TVC" },
                { value: "Video", label: "Video" },
              ]}
              readOnly={readOnly}
            />

            <UploadThumbnail
              name={`dokumenMateri.${index}.thumbnail`}
              readOnly={readOnly}
            />

            <KeywordsInput
              baseName={`dokumenMateri.${index}.keywords`}
              readOnly={readOnly}
            />

            {!readOnly && (
              <button
                type="button"
                className="text-sm text-red-600 hover:underline absolute top-4 right-4"
                onClick={() => remove(index)}
              >
                <Trash2 className="inline mr-1" size={16} />
                Hapus
              </button>
            )}
          </CardContent>
        </Card>
      ))}

      {!readOnly && (
        <Button
          type="button"
          onClick={addDokumen}
          className="bg-black text-white py-2 justify-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Dokumen
        </Button>
      )}
    </div>
  );
}
