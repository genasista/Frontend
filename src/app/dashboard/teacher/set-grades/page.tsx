"use client";

import { Button } from "@/components/ui/button";

const mockToGrade = [
  { id: "g1", student: "Emma Larsson", course: "Matematik 1", assignment: "Delprov 2" },
  { id: "g2", student: "Omar Ali", course: "Svenska 1", assignment: "Skrivuppgift" },
];

export default function TeacherSetGradesPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Sätta betyg</h1>
        <p className="muted">Sätt eller justera betyg för elevens uppgifter.</p>
      </div>

      <div className="surface p-0 overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Elev</th>
              <th>Kurs</th>
              <th>Uppgift</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mockToGrade.map((row) => (
              <tr key={row.id}>
                <td>{row.student}</td>
                <td>{row.course}</td>
                <td>{row.assignment}</td>
                <td className="text-right">
                  <Button size="sm" variant="outline">
                    Sätt betyg
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
