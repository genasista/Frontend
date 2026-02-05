"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function StudentUploadPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Ladda upp</h1>
        <p className="muted">Ladda upp din inlämningsuppgift här.</p>
      </div>

      <div className="surface p-6 space-y-4">
        <label className="text-sm font-medium">Fil</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="input"
        />
        <Button disabled={!file}>Skicka in</Button>
        {file && <p className="text-sm muted">Vald fil: {file.name}</p>}
      </div>
    </div>
  );
}
