"use client";

import { Button } from "@/components/ui/button";

const mockGrades = [
  { course: "Matematik 1", grade: "B", date: "2025-10-20" },
  { course: "Svenska 1", grade: "C", date: "2025-10-18" },
  { course: "Engelska 1", grade: "A", date: "2025-10-15" },
];

export default function StudentGradesPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="heading-1 mb-1">Betyg</h1>
          <p className="muted">Dina satta betyg från läraren.</p>
        </div>
        <Button variant="outline" onClick={() => window.open("/api/grades/export.pdf", "_blank")}>
          Ladda ner som PDF
        </Button>
      </div>

      <div className="surface p-0 overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Kurs</th>
              <th>Betyg</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {mockGrades.map((g, i) => (
              <tr key={i}>
                <td>{g.course}</td>
                <td>{g.grade}</td>
                <td>{g.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
