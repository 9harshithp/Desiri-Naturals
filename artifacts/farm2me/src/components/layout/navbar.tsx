import { Link } from "wouter";
import { ShoppingCart, Leaf, MapPin, Truck, ChevronRight } from "lucide-react";
import { useGetCart } from "@workspace/api-client-react";

export function Navbar() {
  const { data: cart } = useGetCart();
  
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
          <div className="flex items-center gap-4">
            <Link href="/orders" className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block">
              Orders
            </Link>
            <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition-colors">
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
