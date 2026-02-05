"use client";

import { ReactNode, useState, KeyboardEvent, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  FileText,
  Award,
  Calendar,
  Plus,
  History,
  Eye,
  Users,
  X,
  LayoutDashboard,
  Plug,
  ShieldCheck,
  ScrollText,
  BarChart3,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { getClaims } from "@/core/auth/token"; // ADD THIS IMPORT

type Role = "student" | "teacher" | "parent" | "admin";

interface DashboardLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface MenuItem {
  href: string;
  label: string;
  icon: IconComponent;
  external?: boolean;
}

type AuthContextShape = {
  user?: { role?: string; name?: string } | null;
  demoRole?: Role | null;
  setDemoRole?: (r: Role) => void;
  enterDemo?: () => void;
};

export default function DashboardLayout({ children, onLogout }: DashboardLayoutProps) {
  const { user, demoRole, setDemoRole, enterDemo } = useAuth() as AuthContextShape;
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [effectiveRole, setEffectiveRole] = useState<Role>("student");
  const [level, setLevel] = useState<string>("school");

  useEffect(() => {
    const claims = getClaims();
    if (claims?.roles?.[0]) {
      setEffectiveRole(claims.roles[0] as Role);
      setLevel(claims.level || "school");
    } else {
      const isDemo = user?.role === "demo";
      setEffectiveRole(isDemo ? (demoRole ?? "student") : ((user?.role as Role) ?? "student"));
    }
  }, [user, demoRole]);

  // REMOVE THIS OLD LOGIC:
  // const isDemo = user?.role === "demo";
  // const effectiveRole: Role = isDemo ? (demoRole ?? "student") : ((user?.role as Role) ?? "student");

  const handleRoleChange = (r: Role) => {
    const isDemo = user?.role === "demo";
    if (!isDemo) enterDemo?.();
    setDemoRole?.(r);
  };

  const studentMenuItems: MenuItem[] = [
    { href: "/dashboard", label: "Översikt", icon: Home },
    { href: "/dashboard/student/assignments", label: "Mina uppgifter", icon: FileText },
    { href: "/dashboard/student/courses", label: "Mina kurser", icon: BookOpen },
    { href: "/dashboard/student/grades", label: "Betyg", icon: Award },
    { href: "/dashboard/student/upcoming", label: "Kommande kurser", icon: Calendar },
  ];

  const teacherMenuItems: MenuItem[] = [
    { href: "/dashboard", label: "Översikt", icon: Home },
    { href: "/dashboard/teacher/submissions", label: "Rätta uppgifter", icon: Eye },
    { href: "/dashboard/teacher/set-grades", label: "Sätta betyg", icon: Award },
    { href: "/dashboard/teacher/create-assignment", label: "Skapa uppgift", icon: Plus },
    { href: "/dashboard/teacher/assignments", label: "Mina uppgifter", icon: FileText },
    { href: "/dashboard/teacher/assignment-history", label: "Uppgiftshistorik", icon: History },
    { href: "/dashboard/teacher/create-course", label: "Skapa kurs", icon: Plus },
    { href: "/dashboard/teacher/courses", label: "Mina kurser", icon: BookOpen },
    { href: "/dashboard/teacher/course-history", label: "Kurshistorik", icon: History },
    { href: "/dashboard/teacher/classes", label: "Mina klasser", icon: Users },
    { href: "/dashboard/teacher/create-class", label: "Skapa klass", icon: Plus },
  ];

  const parentMenuItems: MenuItem[] = [
    { href: "/dashboard", label: "Översikt", icon: Home },
    { href: "/dashboard/parent/courses", label: "Barnets kurser", icon: BookOpen },
    { href: "/dashboard/parent/grades", label: "Barnets betyg", icon: Award },
  ];

  const schoolAdminMenuItems: MenuItem[] = [
    { href: "/dashboard/school-admin", label: "Översikt", icon: Home },
    { href: "/dashboard/school-admin/teachers", label: "Lärare", icon: Users },
    { href: "/dashboard/school-admin/students", label: "Elever", icon: Users },
    { href: "/dashboard/school-admin/courses", label: "Kurser", icon: BookOpen },
    { href: "/dashboard/school-admin/settings", label: "Inställningar", icon: ShieldCheck },
  ];

  const adminMenuItems: MenuItem[] = [
    { href: "/dashboard/admin", label: "Control Center", icon: LayoutDashboard },
    { href: "/dashboard/admin/rbac", label: "RBAC", icon: ShieldCheck },
    { href: "/dashboard/admin/connections", label: "Connections", icon: Plug },
    { href: "/dashboard/admin/audit", label: "Audit", icon: ScrollText },
    { href: "/dashboard/admin/usage", label: "Usage", icon: BarChart3 },
    { href: "/dashboard/admin/realtime", label: "Realtime", icon: BarChart3 },
    { href: "/swagger", label: "API Docs", icon: BookOpen, external: true as const },
  ];

  const menuItems: MenuItem[] =
    effectiveRole === "admin" && level === "school"
      ? schoolAdminMenuItems
      : effectiveRole === "admin" && level === "municipality"
      ? adminMenuItems
      : effectiveRole === "teacher"
      ? teacherMenuItems
      : effectiveRole === "parent"
      ? parentMenuItems
      : studentMenuItems;

const handleOverlayKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    setMobileOpen(false);
  }
};

const sidebarNav = (
  <nav className="p-4 space-y-1">
    {menuItems.map(({ href, label, icon: Icon, external }) => {
      const isExternal = !!external || href.startsWith("http");
      const active = !isExternal && (pathname === href || pathname.startsWith(href + "/"));

      return isExternal ? (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="menu-link"
          onClick={() => setMobileOpen(false)}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm">{label}</span>
        </a>
      ) : (
        <Link
          key={href}
          href={href}
          className={`menu-link ${active ? "menu-link--active" : ""}`}
          onClick={() => setMobileOpen(false)}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm">{label}</span>
        </Link>
      );
    })}
  </nav>
);

  return (
    <div className="bg-app-gradient-soft min-h-screen">
      <Navbar
        brand="GenAssista"
        variant="solid"
        loggedIn
        onLogout={onLogout}
        onToggleSidebar={() => setMobileOpen((p) => !p)}
      />

      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] items-start py-6">
          <aside className="sidebar rounded-lg border bg-card hidden lg:block">{sidebarNav}</aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>

      {/* mobile overlay */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close menu"
        className={`mobile-overlay ${mobileOpen ? "mobile-overlay--show" : ""}`}
        onClick={() => setMobileOpen(false)}
        onKeyDown={handleOverlayKeyDown}
      />
      {/* mobile drawer */}
      <div className={`mobile-drawer ${mobileOpen ? "mobile-drawer--open" : ""}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <span className="font-semibold">Meny</span>
          <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>
        {sidebarNav}
      </div>
    </div>
  );
}
