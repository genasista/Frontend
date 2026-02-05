"use client";

import { Button } from "@/components/ui/button";

const mockTeacherAssignments = [
  { id: "ta1", title: "NO – Labbrapport", course: "NO", submissions: 14 },
  { id: "ta2", title: "Svenska – Skrivuppgift", course: "Svenska", submissions: 11 },
];

export default function TeacherAssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6 flex items-center justify-between">
        <div>
          <h1 className="heading-1 mb-2">Mina uppgifter</h1>
          <p className="muted">Uppgifter du har skapat.</p>
        </div>
        <Button asChild>
          <a href="/teacher/create-assignment">+ Ny uppgift</a>
        </Button>
      </div>

      <div className="surface p-0">
        <table className="table">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Kurs</th>
              <th>Inlämningar</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mockTeacherAssignments.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.course}</td>
                <td>{a.submissions}</td>
                <td className="text-right">
                  <Button size="sm" variant="outline">Visa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
