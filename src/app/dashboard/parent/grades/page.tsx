"use client";

import { Button } from "@/components/ui/button";

const childGrades = [
  { course: "Matematik 1", grade: "B", date: "2025-10-20" },
  { course: "Svenska 1", grade: "C", date: "2025-10-18" },
];

export default function ParentGradesPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6 flex items-center justify-between">
        <div>
          <h1 className="heading-1 mb-2">Barnets betyg</h1>
          <p className="muted">Överblick över barnets satta betyg.</p>
        </div>
        <Button variant="outline" onClick={() => window.open("/api/grades/export.pdf", "_blank")}>
          Ladda ner PDF
        </Button>
      </div>

      <div className="surface p-0">
        <table className="table">
          <thead>
            <tr>
              <th>Kurs</th>
              <th>Betyg</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {childGrades.map((g, i) => (
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
