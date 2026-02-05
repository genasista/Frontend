"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "../types";

/**
 * Antag att UserRole är t.ex. "student" | "teacher" | "parent" | "demo".
 * Vi vill inte kunna sätta demoRole = "demo", så vi gör en helper-typ:
 */
type RealRole = Exclude<UserRole, "demo">;

interface AuthContextType {
  user: User | null;

  // Auth
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;

  // Demo-läge
  demoRole: RealRole | null;               // vilken roll vi "emulerar" i demo
  setDemoRole: (role: RealRole) => void;   // byt demo-roll (byter INTE user.role)
  enterDemo: () => void;                   // sätt user.role = "demo" och defaulta demoRole
  exitDemo: () => void;                    // lämna demo (sätter en rimlig real roll)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Separat state för demo-lägets “emulerade” roll
  const [demoRole, setDemoRoleState] = useState<RealRole | null>(null);

  const setDemoRole = (role: RealRole) => {
    setDemoRoleState(role); // ändra INTE user.role här
  };

  const enterDemo = () => {
    setUser((prev) => {
      if (!prev) {
        return {
          id: "demo",
          name: "Demo Användare",
          email: "demo@school.com",
          role: "demo" as UserRole,
        } as User;
      }
      if (prev.role !== "demo") {
        return { ...prev, role: "demo" as UserRole };
      }
      return prev;
    });
    setDemoRoleState((r) => r ?? ("student" as RealRole)); // default demo-rollen
  };

  const exitDemo = () => {
    // Välj hur du vill lämna demo. Här sätter vi en default, ex "student".
    setUser((prev) => (prev ? { ...prev, role: "student" as UserRole } : prev));
    setDemoRoleState(null);
  };

  const login = (email: string, password: string): boolean => {
    // Demo-login
    if (email === "demo@school.com" && password === "demo") {
      setUser({
        id: "demo",
        name: "Demo Användare",
        email: "demo@school.com",
        role: "demo" as UserRole,
      } as User);
      setDemoRoleState("student"); // default demo-vy
      return true;
    }

    // Mock andra logins (behåll din logik)
    if (email.includes("student")) {
      setUser({
        id: "1",
        name: "Anna Andersson",
        email,
        role: "student" as UserRole,
      } as User);
      setDemoRoleState(null);
      return true;
    } else if (email.includes("teacher")) {
      setUser({
        id: "2",
        name: "Erik Eriksson",
        email,
        role: "teacher" as UserRole,
      } as User);
      setDemoRoleState(null);
      return true;
    }

    return false;
  };

  const register = (name: string, email: string, password: string, role: UserRole): boolean => {
    setUser({
      id: Math.random().toString(),
      name,
      email,
      role,
    } as User);
    setDemoRoleState(null);
    return true;
  };

  const logout = () => {
    setUser(null);
    setDemoRoleState(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,

    demoRole,
    setDemoRole,
    enterDemo,
    exitDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
