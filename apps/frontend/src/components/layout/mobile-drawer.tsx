import React from "react";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import { usePincode } from "@/context/pincode-context";
import { Button } from "@/components/ui/button";
import {
  Leaf, MapPin, Package, Heart, Phone, ShieldCheck,
  ChevronRight, LogIn, LogOut, ShieldAlert, ShoppingBag,
  Sparkles, ExternalLink, HelpCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { name: "Bull-Driven Oils (2-3 RPM)", slug: "oils", icon: "🏺" },
  { name: "A2 Bilona Cow Ghee & Dairy", slug: "gau-products", icon: "🐄" },
  { name: "Wild Honey & Natural Jaggery", slug: "sweetener", icon: "🍯" },
  { name: "Whole Grains & Millets", slug: "millets", icon: "🌾" },
  { name: "Farm Fresh Seasonal Produce", slug: "fruits-vegetables", icon: "🥬" },
  { name: "Weekly Farm Subscription Boxes", href: "/boxes", icon: "📦" },
];

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { user, logout } = useAuth();
  const { pincodeData, openModal } = usePincode();
  const [, setLocation] = useLocation();

  const handleLinkClick = (href: string) => {
    onClose();
    setLocation(href);
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    setLocation("/");
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="left" className="w-[85vw] sm:max-w-md p-0 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          {/* Header Brand */}
          <div className="p-5 bg-emerald-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-emerald-800 flex items-center justify-center border border-emerald-600/40">
                <Leaf className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <div className="font-serif text-lg font-bold tracking-tight">Desiri Naturals</div>
                <div className="text-[10px] text-emerald-300 uppercase tracking-widest font-mono">
                  Bull-Driven Pure & Farm-Fresh
                </div>
              </div>
            </div>
          </div>

          {/* User Welcome / Status Bar */}
          <div className="px-5">
            {user ? (
              <div className="p-3 bg-muted/60 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Signed in as</div>
                  <div className="font-semibold text-sm text-foreground">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground">{user.email}</div>
                </div>
                {user.role === "admin" && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-[10px]">
                    Admin
                  </Badge>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleLinkClick("/login")}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-10 gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5" /> Login / Signup
                </Button>
              </div>
            )}
          </div>

          {/* Pincode Quick Selector Card */}
          <div className="px-5">
            <button
              type="button"
              onClick={() => {
                onClose();
                openModal();
              }}
              className="w-full text-left p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-muted-foreground uppercase font-medium">Deliver to</div>
                  <div className="text-xs font-bold text-foreground truncate">
                    {pincodeData.city} ({pincodeData.pincode})
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 truncate">
                    {pincodeData.deliveryPromise}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          </div>

          {/* Catalog Categories */}
          <div className="px-5 space-y-1">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Browse Natural Produce
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() =>
                  handleLinkClick(cat.href || `/products?category=${cat.slug}`)
                }
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-muted text-xs font-medium text-foreground flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
              </button>
            ))}
          </div>

          {/* Quick Links & Trust */}
          <div className="px-5 pt-2 border-t space-y-1">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Heritage & Support
            </div>
            <button
              type="button"
              onClick={() => handleLinkClick("/farms")}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-muted text-xs text-foreground flex items-center gap-2.5"
            >
              <Package className="h-4 w-4 text-emerald-600" />
              <span>Our Partner Farms & Cattle Groves</span>
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick("/orders")}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-muted text-xs text-foreground flex items-center gap-2.5"
            >
              <Package className="h-4 w-4 text-emerald-600" />
              <span>Track Orders & Invoices</span>
            </button>
            {user?.role === "admin" && (
              <button
                type="button"
                onClick={() => handleLinkClick("/admin")}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-amber-50 text-xs font-semibold text-amber-700 flex items-center gap-2.5"
              >
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <span>Admin Operations Dashboard</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer WhatsApp Helpline & Logout */}
        <div className="p-5 border-t bg-muted/20 space-y-3">
          <a
            href="https://wa.me/919900088222?text=Hi%20Desiri%20Naturals,%20I%20have%20a%20query%20about%20bull-driven%20oils"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Chat on WhatsApp: +91 99000 88222</span>
          </a>

          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full text-xs text-muted-foreground hover:text-destructive h-9 gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </Button>
          )}

          <div className="text-center text-[10px] text-muted-foreground">
            Desiri Naturals • Pure 2-3 RPM Bull-Driven Ghani Oils
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
