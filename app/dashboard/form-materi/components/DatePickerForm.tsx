"use client";

import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  name: string;
  label: string;
  readOnly?: boolean;
}

export default function DatePickerForm({
  name,
  label,
  readOnly = false,
}: DatePickerProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const selectedDate = watch(name);

  const [date, setDate] = useState<Date | undefined>(() => {
    if (selectedDate instanceof Date) return selectedDate;
    if (typeof selectedDate === "string") {
      const parsed = new Date(selectedDate);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
  });

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setValue(name, format(date, "yyyy-MM-dd"), { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex justify-between"
            disabled={readOnly}
          >
            {date ? format(date, "dd/MM/yyyy") : "Pilih tanggal"}
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        {!readOnly && (
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              initialFocus
            />
          </PopoverContent>
        )}
      </Popover>
      {errors[name] && (
        <p className="text-red-500">{errors[name]?.message as string}</p>
      )}
    </div>
  );
}
