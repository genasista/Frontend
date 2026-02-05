"use client";

const courseHistory = [
  { id: "ch1", name: "Historia 1", period: "Vt 2025", students: 23 },
  { id: "ch2", name: "Biologi 1", period: "Ht 2025", students: 21 },
];

export default function TeacherCourseHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Kurshistorik</h1>
        <p className="muted">Avslutade kurser som du har undervisat.</p>
      </div>

      <div className="surface p-0">
        <table className="table">
          <thead>
            <tr>
              <th>Kurs</th>
              <th>Period</th>
              <th>Antal elever</th>
            </tr>
          </thead>
          <tbody>
            {courseHistory.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.period}</td>
                <td>{c.students}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
