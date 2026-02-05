"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect } from "react";


export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasAnyToken =
      !!localStorage.getItem("auth_token") ||
      !!localStorage.getItem("admin_token") || // legacy, kept for compat
      !!localStorage.getItem("teacher_token"); // legacy, kept for compat


    // Only bounce to /login if we truly have no auth at all.
    if (!user && !hasAnyToken) {
      router.replace("/login");
    }
  }, [user, router]);


  return (
    <DashboardLayout
      onLogout={() => {
        logout();
        router.push("/");
      }}
    >
      {children}
    </DashboardLayout>
  );
}
