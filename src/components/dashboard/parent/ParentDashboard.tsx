"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

/** Exempeldata */
type CourseStatus = "planerad" | "pågående" | "avslutad";
type Course = { id: string; name: string; status: CourseStatus; grade?: string };
type Message = { id: string; from: string; text: string; ts: string };

const courses: Course[] = [
  { id: "1", name: "Matematik 1", status: "pågående" },
  { id: "2", name: "Svenska 1", status: "avslutad", grade: "B" },
  { id: "3", name: "Engelska 1", status: "planerad" },
  { id: "4", name: "NO 1", status: "pågående" },
];

const messages: Message[] = [
  { id: "m1", from: "Lärare: Anna", text: "Bra utveckling senaste veckorna!", ts: "2025-10-21" },
  { id: "m2", from: "Lärare: Johan", text: "Kom ihåg glosor tills fredag.", ts: "2025-10-23" },
];

const progressTrend = [
  { label: "v.36", score: 62 },
  { label: "v.37", score: 66 },
  { label: "v.38", score: 64 },
  { label: "v.39", score: 70 },
  { label: "v.40", score: 72 },
  { label: "v.41", score: 74 },
];

export default function ParentDashboard() {
  const planned = courses.filter(c => c.status === "planerad");
  const ongoing = courses.filter(c => c.status === "pågående");
  const finished = courses.filter(c => c.status === "avslutad");

  return (
    <div className="space-y-6">
      <div className="surface p-6">
        <h1 className="heading-1 mb-2">Översikt för vårdnadshavare</h1>
        <p className="muted">Se barnets kurser, resultat och utveckling.</p>
      </div>

      {/* Utvecklingskurva */}
      <div className="surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Elevens utvecklingskurva</h2>
          <span className="text-xs muted">Veckovis</span>
        </div>

        <ChartContainer
          config={{ score: { label: "Poäng", color: "var(--chart-2)" } }}
          className="h-72 min-w-0"
        >
          <LineChart data={progressTrend} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <CartesianGrid vertical={false} strokeOpacity={0.4} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis width={36} tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey="score" stroke="var(--chart-2)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ChartContainer>
      </div>

      {/* Kurser grupperade */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface p-5">
          <h2 className="text-lg font-medium mb-2">Planerade</h2>
          <ul className="grid gap-2">
            {planned.map(c => (
              <li key={c.id} className="p-2 rounded border">
                <div className="font-medium">{c.name}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface p-5">
          <h2 className="text-lg font-medium mb-2">Pågående</h2>
          <ul className="grid gap-2">
            {ongoing.map(c => (
              <li key={c.id} className="p-2 rounded border">
                <div className="font-medium">{c.name}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface p-5">
          <h2 className="text-lg font-medium mb-2">Avslutade & betyg</h2>
          <ul className="grid gap-2">
            {finished.map(c => (
              <li key={c.id} className="flex items-center justify-between p-2 rounded border">
                <div className="font-medium">{c.name}</div>
                <div className="text-sm">Betyg: <span className="font-medium">{c.grade ?? "-"}</span></div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button onClick={() => window.open("/api/grades/export.pdf", "_blank")}>Ladda ner betyg (PDF)</Button>
          </div>
        </div>
      </div>

      {/* Meddelanden */}
      <div className="surface p-5">
        <h2 className="text-lg font-medium mb-2">Meddelanden</h2>
        <ul className="grid gap-2">
          {messages.map(m => (
            <li key={m.id} className="p-3 rounded border">
              <div className="text-sm">
                <span className="font-medium">{m.from}</span>{" "}
                <span className="text-xs muted">— {m.ts}</span>
              </div>
              <div className="text-sm">{m.text}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
