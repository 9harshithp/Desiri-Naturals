import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
