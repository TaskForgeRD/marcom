"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMateriStore } from "@/store/useMateriStore";

import { useToast } from "@/hooks/use-toast";
import { formSchema, FormDataType } from "@/lib/validation";
import { convertToFormData } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export function useDocumentForm(defaultValues?: Partial<FormDataType>) {
  const router = useRouter();
  const { toast } = useToast();

  const selectedMateri = useMateriStore((state) => state.selectedMateri);
  const fetchData = useMateriStore((state) => state.fetchData);

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const methods = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      brand: "",
      cluster: "",
      fitur: "",
      namaMateri: "",
      jenis: "",
      startDate: "",
      endDate: "",
      dokumenMateri: [
        {
          linkDokumen: "",
          tipeMateri: "",
          thumbnail: "",
          keywords: [""],
        },
      ],
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: FormDataType) => {
    setIsLoading(true);
    setIsDialogOpen(false);

    try {
      const periode =
        new Date(data.endDate).getFullYear() -
        new Date(data.startDate).getFullYear();

      const dataWithPeriode = {
        ...data,
        startDate: new Date(data.startDate).toISOString().split("T")[0],
        endDate: new Date(data.endDate).toISOString().split("T")[0],
        periode,
      };

      const formData = convertToFormData(dataWithPeriode);

      const isEditMode = !!selectedMateri;
      const url = isEditMode
        ? `http://localhost:5000/api/materi/${selectedMateri?.id}`
        : "http://localhost:5000/api/materi";
      const method = isEditMode ? "PUT" : "POST";

      const token = localStorage.getItem("auth_token");

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");

      const result = await response.json();

      useMateriStore.getState().viewMateri(result.id);

      setTimeout(() => {
        useMateriStore.getState().viewMateri("");
      }, 5000);

      await fetchData();

      toast({
        description: (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-green-800 font-semibold">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Data berhasil {isEditMode ? "diperbarui" : "disimpan"}</span>
            </div>
            <span className="text-green-800">
              Materi komunikasi berhasil {isEditMode ? "diupdate" : "ditambahkan"}
            </span>
          </div>
        ),
        className: "bg-green-100 border border-green-300 shadow-md rounded-lg",
      });

      reset();
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan, coba lagi nanti.",
        className: "bg-red-100 text-red-800",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    methods,
    handleSubmit,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    onSubmit,
  };
}
