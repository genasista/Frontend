import { useEffect, useState } from "react";
import { apiFetch } from "@/core/http/client";

interface School {
  id: string;
  name: string;
}

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchools() {
      const res = await apiFetch("/schools");
      if (res.ok && res.data) {
        setSchools(res.data as School[]);
      }
      setLoading(false);
    }
    fetchSchools();
  }, []);

  return { schools, loading };
}