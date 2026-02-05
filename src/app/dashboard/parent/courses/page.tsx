"use client";

const childCourses = [
  { id: "pc1", name: "Matematik 1", status: "Pågående" },
  { id: "pc2", name: "Svenska 1", status: "Avslutad" },
  { id: "pc3", name: "Engelska 1", status: "Planerad" },
];

export default function ParentCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Barnets kurser</h1>
        <p className="muted">Kurser som ditt barn deltar i.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {childCourses.map((c) => (
          <div key={c.id} className="surface p-5">
            <h2 className="text-lg font-medium">{c.name}</h2>
            <p className="text-xs bg-muted/60 inline-flex px-2 py-1 rounded mt-2 capitalize">
              {c.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
