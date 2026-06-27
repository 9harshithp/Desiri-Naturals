import { Link } from "wouter";
import { Leaf, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 pb-8 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-serif font-bold text-primary">Desiri Naturals</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Connecting conscious consumers directly with local farmers. Real food, grown by real people.
            </p>
            <div className="mt-6 flex items-center gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary">All Produce</Link></li>
              <li><Link href="/products?seasonal=true" className="hover:text-primary">Seasonal Picks</Link></li>
              <li><Link href="/boxes" className="hover:text-primary">Subscription Boxes</Link></li>
              <li><Link href="/farms" className="hover:text-primary">Our Farms</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">About Us</a></li>
              <li><a href="#" className="hover:text-primary">How it Works</a></li>
              <li><a href="#" className="hover:text-primary">Careers</a></li>
              <li><a href="#" className="hover:text-primary">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Delivery Zones</a></li>
              <li><a href="#" className="hover:text-primary">Returns</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Desiri Naturals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
