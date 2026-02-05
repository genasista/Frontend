"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { getClaims } from "@/core/auth/token";
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/teacher/TeacherDashboard";
import ParentDashboard from "@/components/dashboard/parent/ParentDashboard";

type Role = "student" | "teacher" | "parent" | "admin";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = React.useState<Role | null>(null);

  React.useEffect(() => {
    // Read role from token claims
    const claims = getClaims();
    if (claims?.roles?.[0]) {
      setRole(claims.roles[0] as Role);
      
      // Redirect admin to admin dashboard
      if (claims.roles[0] === "admin") {
        router.replace("/dashboard/admin");
      }
    } else {
      // No valid token, redirect to login
      router.replace("/login");
    }
  }, [router]);

  if (!role) {
    return <div className="p-6">Laddar...</div>;
  }

  switch (role) {
    case "teacher":
      return <TeacherDashboard />;
    case "parent":
      return <ParentDashboard />;
    case "student":
      return <StudentDashboard />;
    case "admin":
      return null; // Redirecting to /dashboard/admin
    default:
      return <StudentDashboard />;
  }
}