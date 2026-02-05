"use client";


import { useEffect, useState } from "react";
import { getClaims, currentRole, currentLevel } from "@/core/auth/token";


export function useAuthClaims() {
  const [role, setRole] = useState<ReturnType<typeof currentRole> | null>(null);
  const [level, setLevel] = useState<ReturnType<typeof currentLevel> | null>(null);
  const [claims, setClaims] = useState(getClaims());


  useEffect(() => {
    // client-only
    const c = getClaims();
    setClaims(c);
    setRole(currentRole());
    setLevel(currentLevel());
  }, []);


  return { role, level, claims };
}
