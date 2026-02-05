"use client";

import { Button } from "@/components/ui/button";

const teacherCourses = [
  { id: "tc1", name: "Matematik 1", students: 24 },
  { id: "tc2", name: "Svenska 1", students: 22 },
  { id: "tc3", name: "Engelska 1", students: 19 },
];

export default function TeacherCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6 flex items-center justify-between">
        <div>
          <h1 className="heading-1 mb-2">Mina kurser</h1>
          <p className="muted">Kurser du ansvarar för.</p>
        </div>
        <Button asChild>
          <a href="/teacher/create-course">+ Ny kurs</a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teacherCourses.map((c) => (
          <div key={c.id} className="surface p-5">
            <h2 className="text-lg font-medium">{c.name}</h2>
            <p className="text-sm muted mb-2">{c.students} elever</p>
            <Button size="sm" variant="outline">
              Visa kurs
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
