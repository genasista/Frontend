"use client";

const mockCourses = [
  { id: "c1", name: "Matematik 1", status: "Pågående", teacher: "Anna" },
  { id: "c2", name: "Svenska 1", status: "Pågående", teacher: "Erik" },
  { id: "c3", name: "Engelska 1", status: "Avslutad", teacher: "Johan" },
];

export default function StudentCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Mina kurser</h1>
        <p className="muted">Kurser som du är inskriven i.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockCourses.map((c) => (
          <div key={c.id} className="surface p-5">
            <h2 className="text-lg font-medium">{c.name}</h2>
            <p className="text-sm muted mb-2">Lärare: {c.teacher}</p>
            <p className="text-xs inline-flex px-2 py-1 rounded bg-muted/60 capitalize">
              {c.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
