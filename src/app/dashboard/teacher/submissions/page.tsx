"use client";

import { Button } from "@/components/ui/button";

const mockSubmissions = [
  { id: "s1", student: "Emma Larsson", assignment: "NO – Labbrapport", course: "NO", submitted: "för 12 min", status: "Väntar" },
  { id: "s2", student: "Omar Ali", assignment: "Sv – Skrivuppgift", course: "Svenska", submitted: "för 35 min", status: "Väntar" },
];

export default function TeacherSubmissionsPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Rätta uppgifter</h1>
        <p className="muted">Nya inlämningar från dina elever.</p>
      </div>

      <div className="surface p-0 overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Elev</th>
              <th>Uppgift</th>
              <th>Kurs</th>
              <th>Inlämnad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mockSubmissions.map((s) => (
              <tr key={s.id}>
                <td>{s.student}</td>
                <td>{s.assignment}</td>
                <td>{s.course}</td>
                <td>{s.submitted}</td>
                <td className="text-right">
                  <Button size="sm">Rätta</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
