"use client";

const mockHistory = [
  { id: "h1", title: "Matematik – Test 1", date: "2025-09-14", submissions: 22 },
  { id: "h2", title: "Engelska – Reading", date: "2025-09-10", submissions: 19 },
];

export default function TeacherAssignmentHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Uppgiftshistorik</h1>
        <p className="muted">Tidigare uppgifter och hur många som lämnade in.</p>
      </div>

      <div className="surface p-0">
        <table className="table">
          <thead>
            <tr>
              <th>Uppgift</th>
              <th>Datum</th>
              <th>Inlämningar</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((h) => (
              <tr key={h.id}>
                <td>{h.title}</td>
                <td>{h.date}</td>
                <td>{h.submissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
