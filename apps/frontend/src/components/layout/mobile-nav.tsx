import React from "react";
import { Link, useLocation } from "wouter";
import { Home, ShoppingBag, MapPin, ShoppingCart, User } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";
import { useAuth } from "@/context/auth-context";
import { usePincode } from "@/context/pincode-context";

export function MobileNav() {
  const [location] = useLocation();
  const { data: cart } = useGetCart();
  const { user } = useAuth();
  const { pincodeData, openModal } = usePincode();

  const totalItems = cart?.itemCount ?? 0;

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border/70 shadow-lg px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            isActive("/") && location === "/"
              ? "text-emerald-700 dark:text-emerald-400 font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* Shop */}
        <Link
          href="/products"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            isActive("/products")
              ? "text-emerald-700 dark:text-emerald-400 font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-[10px] tracking-tight">Shop</span>
        </Link>

        {/* Pincode Quick Selector */}
        <button
          type="button"
          onClick={openModal}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 transition-all relative"
        >
          <div className="relative">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] tracking-tight font-medium truncate max-w-[54px]">
            {pincodeData.city.split(" ")[0]}
          </span>
        </button>

        {/* Cart */}
        <Link
          href="/cart"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all relative ${
            isActive("/cart")
              ? "text-emerald-700 dark:text-emerald-400 font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-700 text-white font-bold text-[10px] rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-background animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </Link>

        {/* Account / Orders */}
        <Link
          href={user ? "/orders" : "/login"}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            isActive("/login") || isActive("/orders") || isActive("/admin")
              ? "text-emerald-700 dark:text-emerald-400 font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] tracking-tight">
            {user ? "Account" : "Login"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
