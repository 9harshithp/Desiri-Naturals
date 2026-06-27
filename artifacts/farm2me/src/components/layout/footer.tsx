import { Link } from "wouter";
import { Leaf, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#111008] text-white/70">
      {/* Top CTA strip */}
      <div className="border-b border-white/8">
        <div className="container mx-auto px-6 lg:px-8 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-[#e8c97e] text-xs font-semibold tracking-widest uppercase mb-2">Stay Connected</p>
            <h3 className="font-serif text-3xl font-bold text-white">Get seasonal updates<br />& farm stories.</h3>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-64 bg-white/8 border border-white/15 rounded-full px-5 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#e8c97e]/50"
            />
            <button
              type="submit"
              className="rounded-full px-6 py-2.5 bg-[#C4602A] hover:bg-[#a84e22] text-white text-sm font-semibold transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="h-8 w-8 rounded-full bg-[#1B2E1F] flex items-center justify-center">
                <Leaf className="h-4.5 w-4.5 text-[#e8c97e]" />
              </div>
              <span className="font-serif text-lg font-bold text-white">Desiri Naturals</span>
            </Link>
            <p className="text-sm text-white/45 leading-relaxed max-w-xs">
              Towards chemical-free food plates. Bull-powered, traditional, and pure — creating self-sustaining rural communities across India.
            </p>
            <div className="flex items-center gap-4 mt-6 text-white/40">
              <a href="https://instagram.com" target="_blank" rel="noopener" className="hover:text-[#e8c97e] transition-colors"><Instagram className="h-4.5 w-4.5" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener" className="hover:text-[#e8c97e] transition-colors"><Twitter className="h-4.5 w-4.5" /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener" className="hover:text-[#e8c97e] transition-colors"><Youtube className="h-4.5 w-4.5" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-5">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?seasonal=true" className="hover:text-white transition-colors">Seasonal Picks</Link></li>
              <li><Link href="/boxes" className="hover:text-white transition-colors">Subscription Boxes</Link></li>
              <li><Link href="/farms" className="hover:text-white transition-colors">Our Farms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="https://www.desiri.in" target="_blank" rel="noopener" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Visionaries</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Media</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-5">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Delivery Zones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Desiri Naturals. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
