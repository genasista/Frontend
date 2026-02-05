"use client";
import { useRouter } from "next/navigation";
import LandingPage from "@/components/LandingPage";

export default function Page() {
  const router = useRouter();
  return (
    <div className="bg-app-gradient-mid app-screen">
      <LandingPage
        onNavigate={(key: string) => {
          const map: Record<string, string> = {
            login: "/login",
            register: "/register",
            dashboard: "/dashboard",
            "student-assignments": "/student/assignments",
            "student-upload": "/student/upload",
            "student-courses": "/student/courses",
            "student-grades": "/student/grades",
            "student-upcoming": "/student/upcoming",
            "teacher-submissions": "/teacher/submissions",
            "teacher-set-grades": "/teacher/set-grades",
            "teacher-create-assignment": "/teacher/create-assignment",
            "teacher-assignments": "/teacher/assignments",
            "teacher-assignment-history": "/teacher/assignment-history",
            "teacher-create-course": "/teacher/create-course",
            "teacher-courses": "/teacher/courses",
            "teacher-course-history": "/teacher/course-history",
            "parent-courses": "/parent/courses",
            "parent-grades": "/parent/grades",
          };
          router.push(map[key] ?? "/dashboard");
        }}
      />
    </div>
  );
}
