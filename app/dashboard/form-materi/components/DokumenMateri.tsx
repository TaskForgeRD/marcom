import { useFieldArray, useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import SelectField from "../../uiRama/selectField";
import InputField from "../../uiRama/inputField";
import UploadThumbnail from "./UploadThumbnail";
import { KeywordsInput } from "./KeywordsInput";
import ButtonWithIcon from "../../uiRama/buttonWithIcon";
import { Plus, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useMateri } from "@/stores/materi.store";

interface DokumenMateriProps {
  readOnly?: boolean;
}

// Helper function to check if materi is active
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

  // Get current user role
  const { user } = useAuthStore();
  const currentUserRole = user?.role;

  // Get selected materi to check status
  const { selectedMateri } = useMateri();

  // Watch for end_date from form (for new/edit form) or use selectedMateri end_date (for view mode)
  const formEndDate = watch("end_date");
  const materiEndDate = formEndDate || selectedMateri?.end_date;

  // Check if materi is active
  const isActive = isMateriActive(materiEndDate);

  const addDokumen = () => {
    append({
      linkDokumen: "",
      tipeMateri: "",
      thumbnail: undefined,
      keywords: [""],
    });
  };

  // Determine if link should be hidden based on role and status
  const shouldHideLinkDokumen = () => {
    if (currentUserRole === "superadmin") {
      // Superadmin can always see links
      return false;
    }

    if (currentUserRole === "admin" || currentUserRole === "guest") {
      // Admin and guest can only see links if materi is active
      return !isActive;
    }

    // Default: hide for unknown roles
    return true;
  };

  // NEW: Determine if admin should not be able to edit link dokumen
  const shouldBlurLinkForAdmin = () => {
    return currentUserRole === "admin" && !readOnly; // Only blur for admin in edit mode
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

            {/* Input Link Dokumen with conditional blur for different scenarios */}
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
                readOnly={readOnly || blurLinkForAdmin} // Make readonly for admin in edit mode
              />
            </div>

            {/* Show info message for admin in edit mode */}
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
        <ButtonWithIcon
          icon={Plus}
          label="Tambah Dokumen"
          onClick={addDokumen}
          className="bg-black text-white py-2 justify-center"
        />
      )}
    </div>
  );
}
