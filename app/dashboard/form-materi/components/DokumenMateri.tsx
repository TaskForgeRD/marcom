import { useFieldArray, useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import SelectField from "../../uiRama/selectField";
import InputField from "../../uiRama/inputField";
import UploadThumbnail from "./UploadThumbnail";
import { KeywordsInput } from "./KeywordsInput";
import ButtonWithIcon from "../../uiRama/buttonWithIcon";
import { Plus, Trash2 } from "lucide-react";

interface DokumenMateriProps {
  readOnly?: boolean;  
}

export default function DokumenMateri({ readOnly = true }: DokumenMateriProps) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dokumenMateri",
  });

  const addDokumen = () => {
    append({
      linkDokumen: "",
      tipeMateri: "",
      thumbnail: undefined,
      keywords: [""],
    });
  };

  console.log("Fields", fields);

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardContent className="p-6 space-y-4 relative">
            <h3 className="text-lg font-semibold">Dokumen Materi {index + 1}</h3>

            <InputField
              name={`dokumenMateri.${index}.linkDokumen`}
              label="Input Link Dokumen Materi"
              placeholder="Masukkan link dokumen"
              type="url"
              readOnly={readOnly}  
            />

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
