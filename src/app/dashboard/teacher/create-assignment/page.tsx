"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TeacherCreateAssignmentPage() {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [due, setDue] = useState("");

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Skapa uppgift</h1>
        <p className="muted">Skapa en ny inlämningsuppgift till din klass.</p>
      </div>

      <div className="surface p-6 space-y-4 max-w-2xl">
        <div>
          <label className="text-sm font-medium">Titel</label>
          <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Kurs</label>
          <input className="input mt-1" value={course} onChange={(e) => setCourse(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Deadline</label>
          <input type="date" className="input mt-1" value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        <Button>Skapa uppgift</Button>
      </div>
    </div>
  );
}
