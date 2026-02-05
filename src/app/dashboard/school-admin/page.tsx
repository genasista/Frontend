"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Building2, Settings } from "lucide-react";

export default function SchoolAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Skoladministratör</h1>
        <p className="text-muted-foreground">Hantera din skola</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Antal lärare</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Antal elever</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva kurser</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skola</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Norra Gymnasiet</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Snabbåtgärder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded-lg border hover:bg-accent">
              <div className="font-medium">Hantera lärare</div>
              <div className="text-sm text-muted-foreground">Lägg till eller ta bort lärare</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-accent">
              <div className="font-medium">Hantera elever</div>
              <div className="text-sm text-muted-foreground">Se och redigera elevinformation</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border hover:bg-accent">
              <div className="font-medium">Skolinställningar</div>
              <div className="text-sm text-muted-foreground">Konfigurera skolans inställningar</div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Senaste aktivitet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm">
                <p className="font-medium">Ny lärare registrerad</p>
                <p className="text-muted-foreground">Erik Andersson - för 2 timmar sedan</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Kurs skapad</p>
                <p className="text-muted-foreground">Matematik 3c - för 5 timmar sedan</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">Betyg godkända</p>
                <p className="text-muted-foreground">25 betyg - för 1 dag sedan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}