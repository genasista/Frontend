import type { ReactNode } from "react";
import "./globals.css";
import "@/styles/utilities.css";
import SandboxBanner from "@/components/sandboxBanner/SandboxBanner";
import Providers from "./providers";

export const metadata = {
  title: "GenEd - By Genassista",
  description: "En smartare utbildningsplatform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="app-screen">
        <SandboxBanner />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}