"use client";

import { useFormContext } from "react-hook-form";
import InputField from "../../uiRama/inputField";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeywordsInputProps {
  baseName: string;
  readOnly?: boolean;
}

export function KeywordsInput({
  baseName,
  readOnly = false,
}: KeywordsInputProps) {
  const { getValues, setValue, watch } = useFormContext();
  const keywords: string[] = watch(baseName, []);

  const addKeyword = () => {
    if (readOnly) return;
    setValue(baseName, [...getValues(baseName), ""]);
  };

  return (
    <div className="space-y-4">
      {keywords.map((_, index) => (
        <InputField
          key={index}
          name={`${baseName}.${index}`}
          label={`Keyword ${index + 1}`}
          readOnly={readOnly}
        />
      ))}

      {!readOnly && (
        <Button
          type="button"
          onClick={addKeyword}
          variant="outline"
          className="flex items-center gap-2 text-slate-700"
        >
          <PlusCircle className="h-4 w-4" />
          Tambah Keyword
        </Button>
      )}
    </div>
  );
}
