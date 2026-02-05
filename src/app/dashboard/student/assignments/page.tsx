"use client";

import { Button } from "@/components/ui/button";

const mockAssignments = [
  { id: "a1", title: "NO – Labbrapport", course: "NO", due: "2025-11-04", status: "Ej inlämnad" },
  { id: "a2", title: "Svenska – Skrivuppgift", course: "Svenska", due: "2025-11-06", status: "Inlämnad" },
  { id: "a3", title: "Engelska – Reading", course: "Engelska", due: "2025-11-10", status: "Ej inlämnad" },
];

export default function StudentAssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Mina uppgifter</h1>
        <p className="muted">Här ser du alla uppgifter du har just nu.</p>
      </div>

      <div className="surface p-0 overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Uppgift</th>
              <th>Kurs</th>
              <th>Deadline</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mockAssignments.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.course}</td>
                <td>{a.due}</td>
                <td>{a.status}</td>
                <td className="text-right">
                  <Button size="sm" variant="outline">
                    Visa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
