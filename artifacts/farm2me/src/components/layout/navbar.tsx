import { Link, useLocation } from "wouter";
import { ShoppingCart, Leaf, LogOut, Shield, ChevronDown, Menu, X } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useAuth } from "@/context/auth-context";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const { data: cart } = useGetCart();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    setLocation("/");
  };

  const navLinks = [
    { href: "/products", label: "Shop" },
    { href: "/boxes", label: "Subscriptions" },
    { href: "/farms", label: "Our Farms" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-7 w-7 rounded-full bg-[#1B2E1F] flex items-center justify-center">
              <Leaf className="h-4 w-4 text-[#e8c97e]" />
            </div>
            <span className="font-serif text-lg font-bold text-foreground tracking-tight">Desiri Naturals</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* User menu */}
            {user ? (
              <div className="relative hidden md:block" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 h-9 px-3 rounded-full hover:bg-muted/70 transition-colors text-sm font-medium"
                >
                  <div className="h-6 w-6 rounded-full bg-[#1B2E1F] flex items-center justify-center text-[#e8c97e] font-bold text-xs">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="max-w-[90px] truncate text-sm">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-background border border-border rounded-xl shadow-xl py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-border/60 mb-1">
                      <div className="font-semibold text-sm truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-primary font-medium hover:bg-muted/50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <div className="border-t border-border/60 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/60"
              >
                Sign In
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/70 transition-colors"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {cart && cart.itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#C4602A] text-[9px] font-bold text-white">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/70 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background px-4 py-4 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-border/60 mt-2 pt-2">
            {user ? (
              <>
                <div className="px-4 py-2 text-sm font-semibold">{user.name}</div>
                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm text-primary font-medium hover:bg-muted/60 rounded-lg">Admin Dashboard</Link>
                )}
                <Link href="/orders" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg">My Orders</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/60 rounded-lg">Sign Out</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 text-sm font-medium hover:bg-muted/60 rounded-lg">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
