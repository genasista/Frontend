"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { GraduationCap } from "lucide-react";
import { useSchools } from "@/hooks/useSchools";
import { apiFetch } from "@/core/http/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "./ui/select";

export default function LoginPage() {
  const router = useRouter();
  const { schools, loading } = useSchools();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: { email, password, school_id: schoolId }
      });

      if (!res.ok) {
        const errorData = res.data as { message?: string } | undefined;
        throw new Error(errorData?.message || "Inloggning misslyckades");
      }

      const successData = res.data as { token: string; claims: any; user: any };
      
      // Store in localStorage (for RBAC)
      localStorage.setItem("auth_token", successData.token);
      localStorage.setItem("auth_claims", JSON.stringify(successData.claims));
      localStorage.setItem("user_data", JSON.stringify(successData.user));
      
      /// Set legacy keys for backward compatibility
      if (successData.user.role === "admin") {
        localStorage.setItem("admin_token", successData.token);
        localStorage.removeItem("teacher_token");
      } else if (successData.user.role === "teacher") {
        localStorage.setItem("teacher_token", successData.token);
        localStorage.removeItem("admin_token");
      } else {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("teacher_token");
      }
      
      // Role-based redirect
        const role = successData.user.role;
        const level = successData.user.level;

        let dashboardPath = "/dashboard";

        if (role === "admin") {
          if (level === "school") {
            dashboardPath = "/dashboard/school-admin";
          } else {
            dashboardPath = "/dashboard/admin"; // Only municipality admins see dev admin
          }
        } else {
          dashboardPath = "/dashboard"; // All other roles
        }

        router.push(dashboardPath);
        router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fel vid inloggning");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-screen bg-app-gradient flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8 card frosted frosted--rounded text-foreground">
        <div className="flex flex-col items-center mb-8">
          <GraduationCap className="w-12 h-12 mb-2 brand-pink-color" />
          <h1 className="text-2xl">Välkommen tillbaka</h1>
          <p className="muted">Logga in på ditt konto</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="school" className="mb-1">Skola</Label>
            <Select value={schoolId} onValueChange={setSchoolId} required>
              <SelectTrigger >
                <SelectValue placeholder="Välj din skola" />
              </SelectTrigger>
              <SelectContent  style={{backgroundColor: "#ffffff", zIndex: 99999}} >
                  {loading ? (
                    <SelectItem value="loading" disabled>Laddar skolor...</SelectItem>
                  ) : schools.length === 0 ? (
                    <SelectItem value="no-schools" disabled>Inga skolor tillgängliga</SelectItem>
                  ) : (
                    schools.map(school => (
                      <SelectItem key={school.id} value={school.id.toString()}>
                        {school.name}
                      </SelectItem>
                    ))
                  )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email" className="mb-2">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="din@email.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-foreground"
            />
          </div>

          <div>
            <Label htmlFor="password" className="mb-2">Lösenord</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-foreground"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full btn" disabled={busy || !schoolId}>
            {busy ? "Loggar in..." : "Logga in"}
          </Button>
        </form>

        <div className="mt-6 surface-muted rounded-lg p-4">
        <p className="text-sm mb-2 text-foreground/80 font-semibold">Demo-konton:</p>
        
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-medium">Elev:</p>
              <p>Skola: Norra Gymnasiet</p>
              <p>Email: demo.student@school.com</p>
              <p>Lösenord: demo</p>
            </div>

            <div>
              <p className="font-medium">Lärare:</p>
              <p>Skola: Norra Gymnasiet</p>
              <p>Email: demo.teacher@school.com</p>
              <p>Lösenord: demo</p>
            </div>
            
            <div>
              <p className="font-medium">Förälder:</p>
              <p>Skola: Norra Gymnasiet</p>
              <p>Email: demo.parent@school.com</p>
              <p>Lösenord: demo</p>
            </div>

            <div>
              <p className="font-medium">Skoladministratör:</p>
              <p>Skola: Norra Gymnasiet</p>
              <p>Email: demo.schooladmin@school.com</p>
              <p>Lösenord: demo</p>
            </div>
            
            <div>
              <p className="font-medium">Systemadministratör:</p>
              <p>Skola: Vilken som helst (välj Norra Gymnasiet)</p>
              <p>Email: demo.municipalityadmin@school.com</p>
              <p>Lösenord: demo</p>
            </div>
            
          </div>
        </div>
      </Card>
    </div>
  );
}