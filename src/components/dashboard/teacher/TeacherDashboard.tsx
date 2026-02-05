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
import { Check, X } from "lucide-react";

/** Exempeldata – koppla till API sen */
type SubmissionsPoint = { day: string; submissions: number };
const submissions7d: SubmissionsPoint[] = [
  { day: "Mån", submissions: 14 },
  { day: "Tis", submissions: 19 },
  { day: "Ons", submissions: 11 },
  { day: "Tor", submissions: 24 },
  { day: "Fre", submissions: 21 },
  { day: "Lör", submissions: 6 },
  { day: "Sön", submissions: 9 },
];

type CourseProgress = { name: string; avgCompleted: number; total: number };
const courseProgress: CourseProgress[] = [
  { name: "Matematik", avgCompleted: 62, total: 100 },
  { name: "Svenska", avgCompleted: 48, total: 100 },
  { name: "Engelska", avgCompleted: 71, total: 100 },
];

type ClassItem = { id: string; name: string; students: number; pending: { id: string; name: string; email: string }[]; };
type CourseItem = { id: string; name: string; progressPct: number; submissionsToday: number; };

const classes: ClassItem[] = [
  { id: "c-8a", name: "8A", students: 24, pending: [{ id: "s-1", name: "Albin Svensson", email: "albin@skola.se" }] },
  { id: "c-8b", name: "8B", students: 22, pending: [] },
];

const courses: CourseItem[] = [
  { id: "k-math", name: "Matematik 1", progressPct: 62, submissionsToday: 14 },
  { id: "k-swe", name: "Svenska 1", progressPct: 48, submissionsToday: 9 },
  { id: "k-eng", name: "Engelska 1", progressPct: 71, submissionsToday: 12 },
];

async function approveEnrollment(classId: string, studentId: string) {
  await fetch(`/api/classes/${classId}/enrollments/${studentId}`, {
    method: "POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ approved: true }),
  });
}
async function denyEnrollment(classId: string, studentId: string) {
  await fetch(`/api/classes/${classId}/enrollments/${studentId}`, {
    method: "POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ approved: false }),
  });
}

export default function TeacherDashboard() {
  const [classList, setClassList] = React.useState<ClassItem[]>(classes);

  const handleDecision = async (classId: string, studentId: string, approve: boolean) => {
    setClassList(prev =>
      prev.map(c => c.id !== classId ? c : ({ ...c, pending: c.pending.filter(p => p.id !== studentId) }))
    );
    try {
      if (approve) await approveEnrollment(classId, studentId);
      else await denyEnrollment(classId, studentId);
    } catch (e) {
      console.error(e);
      // TODO: ev. revertera vid fel
    }
  };

  return (
    <div className="space-y-6">
      {/* Lärargrafer */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-5 overflow-hidden min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Inlämningar</h2>
            <span className="text-xs muted">Senaste 7 dagar</span>
          </div>
          <ChartContainer
            config={{ submissions: { label: "Inlämningar", color: "var(--chart-2)" } }}
            className="h-72 min-w-0"
          >
            <LineChart data={submissions7d} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <CartesianGrid vertical={false} strokeOpacity={0.4} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis width={36} tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="submissions" stroke="var(--chart-2)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="surface p-5 overflow-hidden min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Klassernas kursframsteg</h2>
            <span className="text-xs muted">Genomsnitt per kurs (%)</span>
          </div>
          <ChartContainer
            config={{ avgCompleted: { label: "Snittprogress", color: "var(--chart-3)" } }}
            className="h-72 min-w-0"
          >
            <BarChart
              data={courseProgress.map(d => ({ name: d.name, avgCompleted: d.avgCompleted }))}
              barCategoryGap={18}
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <CartesianGrid vertical={false} strokeOpacity={0.4} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis width={36} tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="avgCompleted" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Kurser */}
      <div className="surface p-6">
        <h1 className="heading-1 mb-4">Mina kurser</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(c => (
            <div key={c.id} className="surface p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{c.name}</h3>
                <span className="text-xs muted">{c.submissionsToday} inlämn. idag</span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs muted mb-1">
                  <span>Framsteg</span>
                  <span>{c.progressPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted/40">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${c.progressPct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Klasser + godkänn/nek */}
      <div className="surface p-6">
        <h2 className="text-lg font-medium mb-4">Klasser</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classList.map(klass => (
            <div key={klass.id} className="surface p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{klass.name}</h3>
                <span className="text-xs muted">{klass.students} elever</span>
              </div>

              {klass.pending.length > 0 ? (
                <ul className="grid gap-2">
                  {klass.pending.map(p => (
                    <li key={p.id} className="flex items-center justify-between p-2 rounded border">
                      <div className="text-sm">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs muted">{p.email}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDecision(klass.id, p.id, false)}>
                          <X className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={() => handleDecision(klass.id, p.id, true)}>
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm muted">Inga väntande förfrågningar</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
