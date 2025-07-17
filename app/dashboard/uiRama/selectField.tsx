"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import get from "lodash.get";
import clsx from "clsx";

interface ReusableSelectProps {
  name?: string;
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  showLabel?: boolean;
  highlight?: boolean;
}

export default function SelectField({
  name,
  label,
  options,
  value,
  onChange,
  readOnly = false,
  showLabel = true,
  highlight = false,
}: ReusableSelectProps) {
  const form = useFormContext();
  const isForm = !!form && name;

  const handleChange = (val: string) => {
    if (!readOnly) {
      if (isForm) form.setValue(name!, val, { shouldValidate: true });

      if (onChange) onChange(val);
    }
  };

  const rawError = isForm ? get(form.formState.errors, name!) : null;
  const errorMessage =
    typeof rawError?.message === "string" ? rawError.message : "";

  return (
    <div className="space-y-2">
      {showLabel && label && <Label>{label}</Label>}
      <Select
        onValueChange={handleChange}
        value={isForm ? form.watch(name!) : value}
        disabled={readOnly}
      >
        <SelectTrigger
          className={clsx(
            "text-grey-600",
            highlight ? "border-blue-500 focus:border-blue-500" : ""
          )}
        >
          <SelectValue
            placeholder={`Pilih ${label ? label.charAt(0).toUpperCase() + label.slice(1) : "Opsi"}`}
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
}
