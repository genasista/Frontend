"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClaims } from "@/core/auth/token";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is admin from token claims
    const claims = getClaims();
    
    if (!claims) {
      // No valid token, redirect to login
      router.replace("/login");
      return;
    }

    const userIsAdmin = claims.roles?.includes("admin") ?? false;
    setIsAdmin(userIsAdmin);

    if (!userIsAdmin) {
      // Not an admin, redirect to main dashboard
      router.replace("/dashboard");
    }
  }, [router]);

  // Show loading state while checking auth
  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Verifierar behörighet...</div>
      </div>
    );
  }

  // Only render children if user is admin
  if (!isAdmin) return null;

  return <>{children}</>;
}