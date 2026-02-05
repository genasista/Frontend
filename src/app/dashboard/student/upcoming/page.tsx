"use client";

const upcomingCourses = [
  { id: "uc1", name: "Historia 1", start: "2025-11-10" },
  { id: "uc2", name: "Biologi 1", start: "2025-11-17" },
];

export default function StudentUpcomingPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Kommande kurser</h1>
        <p className="muted">Kurser som din lärare har planerat åt klassen.</p>
      </div>

      <div className="surface p-0 overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Kurs</th>
              <th>Startdatum</th>
            </tr>
          </thead>
          <tbody>
            {upcomingCourses.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.start}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
