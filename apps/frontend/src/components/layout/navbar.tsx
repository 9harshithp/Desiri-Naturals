import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import {
  ShoppingCart, Leaf, LogOut, Shield, ChevronDown, Menu, X,
  MapPin, Phone, User, Package, Search, ShieldAlert, CheckCircle2,
  Clock, Truck, Sparkles
} from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useAuth } from "@/context/auth-context";
import { usePincode } from "@/context/pincode-context";
import { PredictiveSearch } from "@/components/search/PredictiveSearch";
import { PincodeModal } from "@/components/pincode/PincodeModal";
import { MobileDrawer } from "./mobile-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: cart } = useGetCart();
  const { user, logout } = useAuth();
  const { pincodeData, openModal } = usePincode();
  const [location, setLocation] = useLocation();
  const searchString = useSearch();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account menu on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalItems = cart?.itemCount ?? 0;
  const cartTotal = cart?.total ? Number(cart.total) : 0;

  const handleLogout = async () => {
    await logout();
    setAccountMenuOpen(false);
    setLocation("/");
  };

  const navLinks = [
    { href: "/products", label: "All Produce" },
    { href: "/products?category=oils", label: "Bull-Driven Oils" },
    { href: "/products?category=gau-products", label: "A2 Desi Ghee" },
    { href: "/boxes", label: "Weekly Subscriptions" },
    { href: "/farms", label: "Our Heritage Farms" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/70 shadow-xs">
        {/* ── TOP ANNOUNCEMENT / TRUST MARQUEE BAR ───────────────────── */}
        <div className="bg-[#122216] text-white py-1.5 px-4 text-[11px] sm:text-xs">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden text-emerald-200 truncate">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-medium tracking-wide truncate">
                🌿 100% Traditional Bull-Driven Ghani Oils (2-3 RPM) • Free Express Delivery in Bengaluru & Mysuru on orders &gt; ₹499
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-4 shrink-0 text-emerald-300">
              <span className="flex items-center gap-1">
                <Truck className="h-3 w-3" /> Same-Day Farm Harvest
              </span>
              <span>•</span>
              <a
                href="https://wa.me/919900088222?text=Hi%20Desiri%20Naturals,%20I%20would%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Phone className="h-3 w-3" /> WhatsApp Order: +91 99000 88222
              </a>
            </div>
          </div>
        </div>

        {/* ── MAIN HEADER ROW ────────────────────────────────────────── */}
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 items-center justify-between gap-3 sm:gap-6">
            
            {/* LEFT: Mobile Hamburger & Logo */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted focus:outline-none"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link href="/" className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-2xl bg-emerald-900 dark:bg-emerald-800 flex items-center justify-center shadow-xs border border-emerald-700/50">
                  <Leaf className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <div className="font-serif text-lg sm:text-xl font-bold text-foreground tracking-tight leading-none">
                    Desiri Naturals
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-mono hidden sm:block mt-0.5">
                    Bull-Driven Pure & Farm-Fresh
                  </div>
                </div>
              </Link>
            </div>

            {/* PINCODE SELECTOR (Desktop & Tablet) */}
            <button
              type="button"
              onClick={openModal}
              className="hidden md:flex items-center gap-2 py-1.5 px-3 rounded-2xl border border-border/80 hover:border-emerald-600 bg-muted/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-left transition-all max-w-[210px] shrink-0"
            >
              <div className="h-7 w-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground uppercase font-semibold leading-none flex items-center gap-1">
                  <span>Deliver to</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="text-xs font-bold text-foreground truncate mt-0.5">
                  {pincodeData.city} ({pincodeData.pincode})
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium truncate">
                  {pincodeData.deliveryPromise.split("(")[0]}
                </div>
              </div>
            </button>

            {/* CENTER: PREDICTIVE SEARCH (Desktop) */}
            <div className="hidden lg:flex flex-1 justify-center max-w-md">
              <PredictiveSearch />
            </div>

            {/* RIGHT: CONTROLS & ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mobile Search Toggle */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted"
                aria-label="Toggle search"
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* WhatsApp Quick Order Button */}
              <a
                href="https://wa.me/919900088222?text=Hi%20Desiri%20Naturals,%20I%20would%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-100 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                <span>Quick WhatsApp Help</span>
              </a>

              {/* User Account / Profile */}
              <div className="relative" ref={accountMenuRef}>
                {user ? (
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-border/70 hover:bg-muted/60 transition-colors text-xs font-medium"
                  >
                    <div className="h-7 w-7 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline-block max-w-[90px] truncate text-foreground font-semibold">
                      {user.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}

                {/* Account Dropdown */}
                {accountMenuOpen && user && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border/80 shadow-xl py-2 z-50 text-left animate-in fade-in-50 zoom-in-95">
                    <div className="px-4 py-2 border-b">
                      <div className="text-xs font-bold text-foreground">{user.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                    </div>

                    <Link
                      href="/orders"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-foreground hover:bg-muted transition-colors"
                    >
                      <Package className="h-4 w-4 text-emerald-600" />
                      <span>My Orders & Invoices</span>
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-destructive hover:bg-destructive/10 w-full transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-transform active:scale-95"
              >
                <div className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-amber-400 text-emerald-950 font-extrabold text-[10px] rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-emerald-900">
                      {totalItems}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-xs font-semibold">
                  {cartTotal > 0 ? `₹${cartTotal.toFixed(0)}` : "Cart"}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ── MOBILE SEARCH & PINCODE SUB-BAR (visible only on small screens) ── */}
        <div className="lg:hidden border-t border-border/50 bg-background px-3 py-2 space-y-2">
          {/* Mobile Pincode Indicator */}
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={openModal}
              className="flex items-center gap-1.5 text-foreground font-medium hover:text-emerald-700"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Deliver to <strong>{pincodeData.city} ({pincodeData.pincode})</strong></span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              {pincodeData.deliveryPromise.split("(")[0]}
            </span>
          </div>

          {/* Mobile Search input */}
          {mobileSearchOpen && (
            <div className="pt-1 animate-in slide-in-from-top-2 duration-150">
              <PredictiveSearch onSelect={() => setMobileSearchOpen(false)} />
            </div>
          )}
        </div>

        {/* ── DESKTOP SECONDARY CATEGORIES BAR ───────────────────────── */}
        <nav className="hidden lg:flex border-t border-border/50 bg-muted/20">
          <div className="container mx-auto px-8 flex items-center gap-6 py-2 text-xs font-medium">
            {navLinks.map(({ href, label }) => {
              const [linkPath, linkSearch] = href.split("?");
              const isPathMatch = location === linkPath;
              const cleanSearch = (searchString || "").replace(/^\?/, "");
              const isSearchMatch = linkSearch 
                ? cleanSearch === linkSearch || (linkSearch === "category=oils" && cleanSearch === "category=cold-pressed-oils") || (linkSearch === "category=gau-products" && cleanSearch === "category=dairy")
                : !cleanSearch || cleanSearch === "";
              const isActive = isPathMatch && isSearchMatch;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`transition-all flex items-center gap-1 py-1 px-2.5 rounded-lg text-xs ${
                    isActive
                      ? "bg-emerald-700 text-white font-bold shadow-xs"
                      : "text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-muted/50"
                  }`}
                >
                  <span>{label}</span>
                </Link>
              );
            })}
            <div className="ml-auto flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% Unrefined & Chemical-Free
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Mysore Farm Harvest Today
              </span>
            </div>
          </div>
        </nav>
      </header>

      {/* ── MODALS & DRAWERS ────────────────────────────────────────── */}
      <PincodeModal />
      <MobileDrawer open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
    </>
  );
}
