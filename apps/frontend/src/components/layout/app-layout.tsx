import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { MobileNav } from "./mobile-nav";
import { FloatingWhatsApp } from "@/components/whatsapp/FloatingWhatsApp";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <MobileNav />
    </div>
  );
}
