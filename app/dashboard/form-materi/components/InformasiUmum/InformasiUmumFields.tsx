import SelectField from "@/app/dashboard/uiRama/selectField";
import InputField from "@/app/dashboard/uiRama/inputField";
import DatePickerForm from "../DatePickerForm";
import { useFormContext } from "react-hook-form";

export type Option = {
  value: string;
  label: string;
};

interface InformasiUmumFieldsProps {
  brandOptions: Option[];
  clusterOptions: Option[];
  fiturOptions: Option[];
  jenisOptions: Option[];
  readOnly?: boolean;
}

export default function InformasiUmumFields({
  brandOptions,
  clusterOptions,
  fiturOptions,
  jenisOptions,
  readOnly = true,
}: InformasiUmumFieldsProps) {
  const { watch } = useFormContext();
  const startDate = watch("start_date");
  const parsedStartDate = startDate ? new Date(startDate) : undefined;
  return (
    <>
      <SelectField
        name="brand"
        label="Brand"
        options={brandOptions}
        readOnly={readOnly}
      />
      <SelectField
        name="cluster"
        label="Cluster"
        options={clusterOptions}
        readOnly={readOnly}
      />
      <SelectField
        name="fitur"
        label="Fitur"
        options={fiturOptions}
        readOnly={readOnly}
      />
      <InputField
        name="nama_materi"
        label="Nama Materi"
        placeholder="Masukkan nama materi"
        readOnly={readOnly}
      />
      <SelectField
        name="jenis"
        label="Jenis"
        options={jenisOptions}
        readOnly={readOnly}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePickerForm
          name="start_date"
          label="Pilih Tanggal Mulai"
          readOnly={readOnly}
        />
        <DatePickerForm
          name="end_date"
          label="Pilih Tanggal Berakhir"
          readOnly={readOnly}
          minDate={parsedStartDate}
        />
      </div>
    </>
  );
}
