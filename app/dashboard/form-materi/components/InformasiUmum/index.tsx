import { Card, CardContent } from "@/components/ui/card";
import { useInformasiUmumOptions } from "@/hooks/useInformasiUmumOptions";
import InformasiUmumFields from "./InformasiUmumFields";

interface InformasiUmumProps {
  readOnly?: boolean;
}

export default function InformasiUmum({ readOnly = true }: InformasiUmumProps) {
  const { jenisOptions, fiturOptions, brandOptions, clusterOptions } =
    useInformasiUmumOptions();

  return (
    <Card className="mb-2">
      <CardContent className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">CICD Sukses</h3>
        <InformasiUmumFields
          brandOptions={brandOptions}
          clusterOptions={clusterOptions}
          fiturOptions={fiturOptions}
          jenisOptions={jenisOptions}
          readOnly={readOnly}
        />
      </CardContent>
    </Card>
  );
}
