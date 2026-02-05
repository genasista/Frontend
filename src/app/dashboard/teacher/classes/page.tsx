"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type PendingStudent = {
  id: string;
  name: string;
  email: string;
};

type TeacherClass = {
  id: string;
  name: string;
  school: string;
  students: number;
  pending: PendingStudent[];
};

const mockClasses: TeacherClass[] = [
  {
    id: "cls-9a",
    name: "9A – Svenska",
    school: "GenEd Skola 1",
    students: 23,
    pending: [
      { id: "p1", name: "Maja Karlsson", email: "maja.karlsson@skola.se" },
      { id: "p2", name: "Lucas Andersson", email: "lucas.andersson@skola.se" },
    ],
  },
  {
    id: "cls-9b",
    name: "9B – Matematik",
    school: "GenEd Skola 1",
    students: 21,
    pending: [],
  },
];

export default function TeacherClassesPage() {
  // liten lokal state bara för att visa effekten av godkänn/neka
  const [classes, setClasses] = useState<TeacherClass[]>(mockClasses);

  const approveStudent = (classId: string, studentId: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        const pending = c.pending.filter((p) => p.id !== studentId);
        // här skulle du också öka c.students med 1 om du vill
        return { ...c, pending, students: c.students + 1 };
      })
    );
    // TODO: här ska ni kalla ert API:
    // await api.classes.approveStudent(classId, studentId)
  };

  const rejectStudent = (classId: string, studentId: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        const pending = c.pending.filter((p) => p.id !== studentId);
        return { ...c, pending };
      })
    );
    // TODO: api.classes.rejectStudent(classId, studentId)
  };

  return (
    <div className="space-y-6">
      <div className="surface p-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="heading-1 mb-2">Mina klasser</h1>
          <p className="muted">Hantera dina klasser och godkänn elever som vill gå med.</p>
        </div>
        <Button asChild>
          <a href="/dashboard/teacher/create-class">+ Skapa ny klass</a>
        </Button>
      </div>

      <div className="space-y-4">
        {classes.map((cls) => (
          <div key={cls.id} className="surface p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{cls.name}</h2>
                <p className="text-sm muted">{cls.school}</p>
              </div>
              <p className="text-sm muted">{cls.students} elever</p>
            </div>

            {cls.pending.length > 0 ? (
              <div>
                <p className="text-sm font-medium mb-2">Väntande elever</p>
                <div className="flex flex-col gap-2">
                  {cls.pending.map((stu) => (
                    <div
                      key={stu.id}
                      className="flex items-center justify-between gap-3 rounded-md bg-muted/40 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{stu.name}</p>
                        <p className="text-xs muted">{stu.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => approveStudent(cls.id, stu.id)}>
                          Godkänn
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectStudent(cls.id, stu.id)}
                        >
                          Neka
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm muted">Inga väntande elever.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
