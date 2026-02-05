"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { devMintToken, clearDevAuth, getClaims, currentRole, currentLevel } from "@/core/auth/token";
import { apiFetch } from "@/core/http/client";

export default function RoleAwareDemo() {
  const [authKey, setAuthKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  
  // Read auth state directly from localStorage on each render
  const [role, setRole] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [claims, setClaims] = useState<ReturnType<typeof getClaims>>(null);

  // Update auth state whenever authKey changes
  useEffect(() => {
    setRole(currentRole());
    setLevel(currentLevel());
    setClaims(getClaims());
  }, [authKey]);

  const canManage = level === "school" || level === "municipality";

  async function runProtectedAction() {
    setBusy(true);
    try {
      const name = `ui-test-${Date.now()}`;
      const res = await apiFetch("/connections", {
        method: "POST",
        body: { name, enabled: true, config: { from: "ui-demo" } },
      });
      if (!res.ok) {
        let errorMsg = `HTTP ${res.status}`;
        if (res.data && typeof res.data === 'object' && 'message' in res.data) {
          errorMsg = String(res.data.message);
        }
        throw new Error(errorMsg);
      }
      alert("Protected action OK (connection created)");
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Protected action failed";
      alert(errorMessage);
    } finally {
      setBusy(false);
    }
  }

  async function signTeacher() {
    await devMintToken("teacher", "teacher");
    setAuthKey(prev => prev + 1);
    router.refresh();
  }
  
  async function signAdminSchool() {
    await devMintToken("admin", "school");
    setAuthKey(prev => prev + 1);
    router.refresh();
  }
  
  async function signAdminMunicipality() {
    await devMintToken("admin", "municipality");
    setAuthKey(prev => prev + 1);
    router.refresh();
  }
  
  function signOut() {
    clearDevAuth();
    setAuthKey(prev => prev + 1);
    router.refresh();
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>RBAC demo (SCRUM-19.3)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-sm text-muted-foreground">
            Current: <b>{role ?? "—"}</b> @ <b>{level ?? "—"}</b>
          </span>
          {claims?.orgId ? <span className="text-xs">org: {claims.orgId}</span> : null}
          {claims?.schoolId ? <span className="text-xs">school: {claims.schoolId}</span> : null}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={signTeacher}>
            Sign in as Teacher
          </Button>
          <Button variant="outline" size="sm" onClick={signAdminSchool}>
            Sign in as Admin (School)
          </Button>
          <Button variant="outline" size="sm" onClick={signAdminMunicipality}>
            Sign in as Admin (Municipality)
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>

        <div className="pt-2">
          <Button
            data-testid="protected-create-connection"
            onClick={runProtectedAction}
            disabled={!canManage || busy}
          >
            {canManage ? "Create test connection (protected)" : "No permission (teacher)"}
          </Button>
          {!canManage && (
            <p className="text-xs text-muted-foreground mt-2">
              This action requires level <b>school</b> or <b>municipality</b>. Your token is only <b>{level}</b>.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}