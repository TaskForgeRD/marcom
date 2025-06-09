"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import FormMateri from "../components/FormMateri";
import { useMateri } from "@/stores/useMateri";

export default function DetailMateriPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? undefined;

  const { data, setSelectedMateri, selectedMateri } = useMateri();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMateriDetail = async () => {
      // Cek dulu apakah ada di store
      let materi = data.find((item) => item.id === Number(id));

      console.log(materi)
      
      // Jika tidak ada (karena refresh), ambil dari API
      if (!materi && id) {
        try {
          const raw = localStorage.getItem("marcom-auth-store");
          const token = raw ? JSON.parse(raw)?.state?.token : null;
          const response = await fetch(`http://localhost:5000/api/materi/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            materi = await response.json();
          }
        } catch (error) {
          console.error("Error fetching materi detail:", error);
        }
      }
      
      if (materi) {
        setSelectedMateri(materi);
      }
      
      setIsLoading(false);
      console.log(materi)
    };

    fetchMateriDetail();
  }, [id, data, setSelectedMateri]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return <FormMateri mode={mode} />;
}