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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { CalendarDays, CheckCircle2 } from "lucide-react";

/** Exempeldata – byt mot dina fetchers */
type CourseProgress = { name: string; completed: number; total: number };
const progressData: CourseProgress[] = [
  { name: "Matematik", completed: 8, total: 10 },
  { name: "Svenska", completed: 6, total: 10 },
  { name: "Engelska", completed: 7, total: 10 },
  { name: "NO", completed: 5, total: 10 },
  { name: "SO", completed: 9, total: 10 },
];

type AssignmentPoint = { day: string; active: number };
const assignments7d: AssignmentPoint[] = [
  { day: "Mån", active: 2 },
  { day: "Tis", active: 3 },
  { day: "Ons", active: 2 },
  { day: "Tor", active: 4 },
  { day: "Fre", active: 3 },
  { day: "Lör", active: 1 },
  { day: "Sön", active: 2 },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="surface p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="heading-1">Översikt</h1>
            <p className="muted">Dina kurser, uppgifter och senaste händelser.</p>
          </div>
          <div className="flex gap-2">
            <Button className="btn" variant="outline">
              <CalendarDays className="mr-2 h-4 w-4" />
              Schema
            </Button>
          </div>
        </div>
      </div>

      {/* Grafer för egna uppgifter & framsteg */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Aktiva uppgifter (senaste 7 dagar) */}
        <div className="surface p-5 overflow-hidden min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Aktiva uppgifter</h2>
            <span className="text-xs muted">Senaste 7 dagar</span>
          </div>

          <ChartContainer
            config={{
              active: { label: "Aktiva uppgifter", color: "var(--chart-1)" },
            }}
            className="h-72 min-w-0"
          >
            {/* Line */}
            <LineChart
              data={assignments7d}
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <CartesianGrid vertical={false} strokeOpacity={0.4} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis width={36} tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="active"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Eget kursframsteg */}
        <div className="surface p-5 overflow-hidden min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Ditt kursframsteg</h2>
            <span className="text-xs muted">Pågående moduler</span>
          </div>

          <ChartContainer
            config={{
              completed: { label: "Klart", color: "var(--chart-3)" },
              remaining: { label: "Kvar", color: "var(--chart-5)" },
            }}
            className="h-72 min-w-0"
          >
            <BarChart
              data={progressData.map((d) => ({
                name: d.name,
                completed: d.completed,
                remaining: Math.max(d.total - d.completed, 0),
              }))}
              barCategoryGap={18}
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <CartesianGrid vertical={false} strokeOpacity={0.4} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis width={36} tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="completed" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="remaining" fill="var(--chart-5)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Senaste aktivitet – endast elevsäkra händelser */}
      <div className="surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Senaste aktivitet</h2>
          <Button className="btn" variant="outline" size="sm">Visa alla</Button>
        </div>

        <ul className="divide-y">
          {[
            { text: "Rättad uppgift i Matematik – Delprov 2", when: "för 12 min" },
            { text: "Inlämningsuppgift tillgänglig för NO – Laboration", when: "för 45 min" },
            { text: "Nytt meddelande från lärare Anna", when: "för 1 tim" },
            { text: "Inlämning registrerad i Svenska – Skrivuppgift", when: "för 2 tim" },
          ].map((row, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 muted" />
                <div>
                  <div className="text-sm">
                    <span className="font-medium">{row.text}</span>
                  </div>
                  <div className="text-xs muted">{row.when}</div>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                Detaljer
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
