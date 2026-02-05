"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TeacherCreateClassPage() {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("GenEd Skola 1");
  const [description, setDescription] = useState("");
  const [autoApprove, setAutoApprove] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: anropa backend:
    // await api.classes.create({ name, school, description, autoApprove })
    alert("Klass skapad (mock)!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Skapa klass</h1>
        <p className="muted">
          Skapa en ny klass som elever kan ansöka till med sin skol-e-post.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="surface p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Klassnamn</label>
          <input
            className="input mt-1 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. 9A – Matematik"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Skola</label>
          <input
            className="input mt-1 w-full"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Beskrivning (valfritt)</label>
          <textarea
            className="input mt-1 w-full"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="T.ex. Klass för alla NO-lektioner vårterminen."
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoApprove}
            onChange={(e) => setAutoApprove(e.target.checked)}
          />
          Godkänn elever automatiskt
        </label>

        <Button type="submit">Skapa klass</Button>
      </form>
    </div>
  );
}
