"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClaims } from "@/core/auth/token";

export interface NavbarProps {
  brand?: string;
  // marketing
  showAuthButtons?: boolean;
  onLogin?: () => void;
  onRegister?: () => void;
  // app
  loggedIn?: boolean;
  onLogout?: () => void;
  // visual
  variant?: "default" | "solid";
  className?: string;
  rightSlot?: React.ReactNode;
  /** mobil: öppna dashboard-menyn */
  onToggleSidebar?: () => void;
}

export default function Navbar({
  brand = "GenAssista",
  showAuthButtons = false,
  onLogin,
  onRegister,
  loggedIn = false,
  onLogout,
  variant = "default",
  className,
  rightSlot,
  onToggleSidebar,
}: NavbarProps) {
  const [userName, setUserName] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  // Get user info from claims
  React.useEffect(() => {
    if (loggedIn && typeof window !== "undefined") {
      const claims = getClaims();
      if (claims) {
        // Try to get name from localStorage (stored during login)
        const userDataStr = localStorage.getItem("user_data");
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            setUserName(`${userData.firstName} ${userData.lastName}`);
          } catch {
            setUserName(claims.sub);
          }
        } else {
          setUserName(claims.sub);
        }
        
        // Format role for display
        const role = claims.roles?.[0] || "user";
        const level = claims.level;
        
        if (role === "admin" && level === "municipality") {
          setUserRole("Systemadministratör");
        } else if (role === "admin" && level === "school") {
          setUserRole("Skoladministratör");
        } else if (role === "teacher") {
          setUserRole("Lärare");
        } else if (role === "parent") {
          setUserRole("Förälder");
        } else if (role === "student") {
          setUserRole("Elev");
        } else {
          setUserRole(role);
        }
      }
    }
  }, [loggedIn]);

  return (
    <nav className={`${variant === "solid" ? "navbar navbar--solid" : "navbar"} ${className ?? ""}`}>
      <div className="navbar-inner container-page">
        {/* left: brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="brand" aria-label={brand}>
            <GraduationCap className="logo text-[--brand] brand-pink-color" />
            <span className="text-xl genassista-gradient-text">{brand}</span>
          </Link>
        </div>

        {/* right actions */}
        <div className="cluster-md">
          {rightSlot}

          {!loggedIn && showAuthButtons && (
            <>
              <Button variant="ghost" onClick={onLogin}>
                Logga in
              </Button>
              <Button onClick={onRegister}>Kom igång</Button>
            </>
          )}

          {loggedIn && (
            <>
              {/* User info display */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 max-sm:hidden">
                <User className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userName || "Användare"}</span>
                  <span className="text-xs text-muted-foreground">{userRole || "Roll"}</span>
                </div>
              </div>

              <div className="cluster-sm">
                <Button variant="ghost" size="sm" onClick={onLogout} className="nav-btn">
                  Logga ut
                </Button>
              </div>

              {/* mobile menu button */}
              {onToggleSidebar && (
                <button
                  type="button"
                  onClick={onToggleSidebar}
                  className="inline-flex items-center justify-center rounded-md border bg-background/60 p-2 lg:hidden"
                  aria-label="Öppna meny"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
