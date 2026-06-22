import { Link, useLocation } from "wouter";
import { ShoppingCart, Leaf, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useAuth } from "@/context/auth-context";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const { data: cart } = useGetCart();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground">
        Free delivery on orders above ₹500
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-serif font-bold text-primary">Farm2Me</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Shop Produce
              </Link>
              <Link href="/boxes" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Subscription Boxes
              </Link>
              <Link href="/farms" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Our Farms
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 h-9 px-3 rounded-full hover:bg-muted transition-colors text-sm font-medium"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-background border rounded-xl shadow-lg py-1 z-50">
                    <div className="px-4 py-2.5 border-b">
                      <div className="font-medium text-sm truncate">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-primary font-medium"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4" /> Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User className="h-4 w-4 text-muted-foreground" /> My Orders
                    </Link>
                    <div className="border-t mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-muted-foreground"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart && cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                  {cart.itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
