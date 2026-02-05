"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TeacherCreateCoursePage() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Skapa kurs</h1>
        <p className="muted">Skapa en ny kurs för din klass.</p>
      </div>

      <div className="surface p-6 space-y-4 max-w-2xl">
        <div>
          <label className="text-sm font-medium">Kursnamn</label>
          <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Beskrivning</label>
          <textarea className="input mt-1" rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <Button>Skapa kurs</Button>
      </div>
    </div>
  );
}
