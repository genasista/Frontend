// Enkel hjälpare: använd riktig roll om den finns, annars acceptera dev-admin-token lokalt.
export function isAdmin(user?: { role?: string } | null): boolean {
  if (user?.role === "admin") return true;
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("admin_token"); // dev-läge
  }
  return false;
}
