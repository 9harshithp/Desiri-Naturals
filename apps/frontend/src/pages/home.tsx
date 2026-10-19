import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Leaf, ShieldCheck, Clock, MapPin, Zap, Users, Recycle } from "lucide-react";
import {
  useListFeaturedProducts,
  useListCategories,
  useGetDiscoverSummary,
  useListFarms,
} from "@workspace/api-client-react";

const MARQUEE_ITEMS = [
  "Bull-Powered Extraction",
  "Chemical Free",
  "Traditional Methods",
  "Purity Certified",
  "Plastic Free",
  "Zero Waste",
  "Women Empowered",
  "Farm to Table",
];

const CATEGORY_IMAGES: Record<string, string> = {
  vegetables: "/images/cat-vegetables.png",
  fruits: "/images/cat-fruits.png",
  dairy: "/images/cat-dairy.png",
  oils: "/images/cat-oils.png",
};

const CATEGORY_ICONS: Record<string, string> = {
  grains: "🌾", herbs: "🌿", spices: "🌶️", honey: "🍯",
};

const DEFAULT_CATEGORIES = [
  { id: 1, name: "Bull-Driven Oils", slug: "oils", imageUrl: "/images/cat-oils.png" },
  { id: 2, name: "A2 Desi Ghee", slug: "gau-products", imageUrl: "/images/cat-dairy.png" },
  { id: 3, name: "Millets & Grains", slug: "millets", imageUrl: "/images/cat-vegetables.png" },
  { id: 4, name: "Natural Sweeteners", slug: "sweetener", imageUrl: "/images/cat-fruits.png" },
  { id: 5, name: "Pure Spices", slug: "spices", imageUrl: "/images/cat-vegetables.png" },
];

const DEFAULT_FEATURED = [
  {
    id: 1,
    name: "Bull-Driven Groundnut Oil (Wood Pressed)",
    slug: "bull-driven-groundnut-oil",
    price: 380,
    unit: "1 Litre Glass Bottle",
    category: "oils",
    description: "Cold-pressed using indigenous Kangayam bullocks at 2-3 RPM in wooden Marachekku.",
    organic: true,
    inStock: true,
    freshnessScore: 98,
    rating: "4.9",
    imageUrl: "/images/desiri-glass-bottle.png",
  },
  {
    id: 2,
    name: "A2 Gir Cow Bilona Cultured Desi Ghee",
    slug: "a2-gir-cow-bilona-ghee",
    price: 1450,
    unit: "500 ml Glass Jar",
    category: "gau-products",
    description: "Prepared using traditional wooden churner from curd of grass-fed Gir cows.",
    organic: true,
    inStock: true,
    freshnessScore: 99,
    rating: "5.0",
    imageUrl: "/images/desiri-tin-can.png",
  },
  {
    id: 3,
    name: "Pure Bull-Driven Sesame / Gingelly Oil",
    slug: "bull-driven-sesame-oil",
    price: 490,
    unit: "1 Litre Glass Bottle",
    category: "oils",
    description: "Wood-pressed with organic palm jaggery for authentic taste and maximum nutrients.",
    organic: true,
    inStock: true,
    freshnessScore: 96,
    rating: "4.8",
    imageUrl: "/images/desiri-glass-bottle.png",
  },
  {
    id: 4,
    name: "Desi Coconut Oil (Bull-Driven Marachekku)",
    slug: "desi-coconut-oil",
    price: 410,
    unit: "1 Litre Glass Bottle",
    category: "oils",
    description: "Extracted from sun-dried natural sulphur-free copra at room temperature.",
    organic: true,
    inStock: true,
    freshnessScore: 97,
    rating: "4.9",
    imageUrl: "/images/desiri-glass-bottle.png",
  },
];

export default function Home() {
  const { data: featuredProducts } = useListFeaturedProducts();
  const { data: categories } = useListCategories();
  const { data: summary } = useGetDiscoverSummary();
  const { data: farms } = useListFarms();

  const displayCategories = Array.isArray(categories) && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const displayProducts = Array.isArray(featuredProducts) && featuredProducts.length > 0 ? (featuredProducts as any[]) : DEFAULT_FEATURED;
  const displayFarms = Array.isArray(farms) ? farms : [];

  const marqueeText = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[92vh] flex items-end bg-[#111008] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero.png"
            alt="Fresh produce"
            className="w-full h-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111008] via-[#111008]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111008]/80 via-transparent to-transparent" />
        </div>

        {/* Floating pill — top right */}
        <div className="absolute top-8 right-8 hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Harvested fresh this morning
        </div>

        <div className="relative container mx-auto px-6 lg:px-8 pb-20 pt-32">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-10 bg-[#C4602A]" />
              <span className="text-[#C4602A] text-sm font-semibold tracking-widest uppercase">Desiri Naturals</span>
            </div>

            {/* Main headline */}
            <h1 className="font-serif text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight text-white mb-8">
              Towards<br />
              <em className="not-italic text-[#e8c97e]">Chemical-free</em><br />
              Food Plates.
            </h1>

            <p className="text-white/65 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Bull-powered extraction. Traditional farming. Zero compromise.
              Real food for real people — delivered from farm to your door.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full h-14 px-9 text-base bg-[#C4602A] hover:bg-[#a84e22] border-0 text-white" asChild>
                <Link href="/products">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-9 text-base bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover:text-white" asChild>
                <Link href="/farms">Our Story</Link>
              </Button>
            </div>
          </div>

          {/* Stat strip */}
          {summary && (
            <div className="mt-20 flex flex-wrap gap-x-12 gap-y-6">
              {[
                { val: `${summary.totalFarms}+`, label: "Partner Farms" },
                { val: `${summary.organicPercentage}%`, label: "Chemical Free" },
                { val: `<${summary.avgDeliveryHours}h`, label: "Farm to Door" },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="font-serif text-4xl font-bold text-[#e8c97e]">{val}</span>
                  <span className="text-white/50 text-sm tracking-wide uppercase">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────── */}
      <div className="bg-[#C4602A] py-3.5 overflow-hidden flex">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {marqueeText.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 text-white font-semibold text-sm tracking-widest uppercase shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── BRAND STORY ──────────────────────────────────────── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <div>
              <p className="text-[#C4602A] text-sm font-semibold tracking-widest uppercase mb-6">Our Philosophy</p>
              <h2 className="font-serif text-5xl md:text-6xl font-bold leading-[1.1] mb-8 text-foreground">
                Real food<br />shouldn't have<br />shortcuts.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We use traditional bull-powered oil extraction — the same method our ancestors used for centuries — to preserve every nutrient, every flavour, every drop of purity. No heat, no chemicals, no compromise.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                Our model creates self-sustaining rural communities, empowers women farmers, preserves native Indian bull breeds, and ensures fair prices at every step.
              </p>
              <Link href="/farms" className="inline-flex items-center gap-2 text-foreground font-semibold text-base border-b-2 border-[#C4602A] pb-0.5 hover:text-[#C4602A] transition-colors">
                Meet our farmers <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right — value tiles */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { img: "/images/phil-bull-powered.png", title: "Bull-Powered", desc: "Traditional stone-pressed extraction preserving full nutrition" },
                { img: "/images/phil-chemical-free.png", title: "Chemical Free", desc: "Natural pest management, zero synthetic inputs on your food" },
                { img: "/images/phil-zero-waste.png", title: "Zero Waste", desc: "Plastic-free packaging, every part of the harvest is used" },
                { img: "/images/phil-women-led.png", title: "Women-Led", desc: "Empowering rural women farmers at every step of production" },
                { img: "/images/phil-lab-certified.png", title: "Lab Certified", desc: "In-house purity testing on every batch before it ships" },
                { img: "/images/phil-water-smart.png", title: "Water Smart", desc: "Traditional water conservation techniques on all partner farms" },
              ].map(({ img, title, desc }) => (
                <div key={title} className="group rounded-2xl border border-border/50 hover:border-[#C4602A]/40 transition-all overflow-hidden bg-card">
                  <div className="aspect-[3/2] w-full overflow-hidden bg-muted">
                    <img
                      src={img}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-foreground mb-1 text-sm">{title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="py-20 bg-[#1B2E1F] overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[#C4602A] text-sm font-semibold tracking-widest uppercase mb-3">Browse</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Shop by category</h2>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-white/60 hover:text-white font-medium transition-colors text-sm">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="flex gap-4 px-6 lg:px-8 overflow-x-auto pb-2 scrollbar-none">
          {displayCategories.map((category) => {
            const imgSrc = category.imageUrl || CATEGORY_IMAGES[category.slug];
            const fallbackIcon = CATEGORY_ICONS[category.slug] ?? "🌾";
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group flex-shrink-0 flex flex-col items-center gap-4 w-36"
              >
                <div className="w-36 h-36 rounded-2xl bg-white/10 border border-white/10 group-hover:border-[#C4602A]/50 transition-all overflow-hidden relative">
                  {imgSrc ? (
                    <>
                      <img src={imgSrc} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-white/5 group-hover:bg-[#C4602A]/20 transition-colors">
                      {fallbackIcon}
                    </div>
                  )}
                </div>
                <span className="text-white/80 text-sm font-medium text-center group-hover:text-white transition-colors">{category.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="text-[#C4602A] text-sm font-semibold tracking-widest uppercase mb-3">Today's Pick</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold">Fresh from the fields</h2>
              <p className="text-muted-foreground text-lg mt-3 max-w-md">Hand-picked this morning. Ready for your kitchen tomorrow.</p>
            </div>
            <Button variant="outline" className="rounded-full shrink-0 h-12 px-7 border-foreground/30 hover:border-foreground" asChild>
              <Link href="/products">View all produce <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-28 bg-[#1B2E1F] relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-white/5" />

        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-xl mb-16">
            <p className="text-[#C4602A] text-sm font-semibold tracking-widest uppercase mb-4">The Process</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
              How Desiri<br />Naturals works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { n: "01", title: "You Order", body: "Browse and order from our range of traditional, pure products. Place your order by 8 PM for next-day delivery." },
              { n: "02", title: "Farmers Produce", body: "Our partner farmers harvest or press your order in the early morning using bull-powered, traditional methods." },
              { n: "03", title: "We Deliver", body: "Your order arrives at your door in eco-friendly, plastic-free packaging — fresh, pure, and fully traceable." },
            ].map(({ n, title, body }) => (
              <div key={n} className="relative">
                <div className="font-serif text-8xl font-bold text-white/5 absolute -top-6 -left-2 select-none">{n}</div>
                <div className="relative">
                  <div className="text-[#e8c97e] font-mono text-sm font-bold mb-4">{n}</div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-white/55 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 pt-16 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="text-white/60 max-w-lg">Eliminate the middlemen. Farmers earn more. You eat better. Everyone wins.</p>
            <Button className="rounded-full h-12 px-8 bg-[#C4602A] hover:bg-[#a84e22] border-0 text-white shrink-0" asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────── */}
      <section className="py-16 bg-[#e8c97e]/20 border-y border-[#e8c97e]/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: ShieldCheck, title: "100% Traceable", desc: "Know exactly which farm your food came from" },
              { icon: Leaf, title: "No Chemicals", desc: "Certified pesticide-free on every product" },
              { icon: Clock, title: "24hr Farm-to-Home", desc: "Harvested today, at your door tomorrow" },
              { icon: Users, title: "Fair to Farmers", desc: "Farmers set prices, keep 80% of revenue" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[#1B2E1F] flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[#e8c97e]" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">{title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-[160px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FARM STORIES ─────────────────────────────────────── */}
      {displayFarms.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[#C4602A] text-sm font-semibold tracking-widest uppercase mb-3">Our Partners</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold">Behind every product,<br />a real farm.</h2>
              </div>
              <Link href="/farms" className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">
                All farms <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {displayFarms.slice(0, 3).map((farm) => (
                <Link key={farm.id} href={`/farms/${farm.id}`} className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted border border-border hover:border-[#C4602A]/40 transition-all">
                  {farm.imageUrl ? (
                    <img src={farm.imageUrl} alt={farm.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1B2E1F] to-[#2d4a34] flex items-center justify-center">
                      <Leaf className="h-16 w-16 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge className="mb-3 bg-[#C4602A]/90 text-white border-0 text-xs">Partner Farm</Badge>
                    <h3 className="font-serif text-xl font-bold text-white mb-1">{farm.name}</h3>
                    <p className="text-white/60 text-sm flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {farm.location}{farm.state ? `, ${farm.state}` : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SUBSCRIPTION CTA ─────────────────────────────────── */}
      <section className="py-0 bg-[#1B2E1F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#e8c97e]" />
        </div>
        <div className="relative container mx-auto px-6 lg:px-8 py-28">
          <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center">
            <div>
              <p className="text-[#C4602A] text-sm font-semibold tracking-widest uppercase mb-6">Subscription Boxes</p>
              <h2 className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                Let the seasons<br />decide your menu.
              </h2>
              <p className="text-white/55 text-lg mb-10 max-w-lg leading-relaxed">
                Curated weekly boxes of the freshest seasonal produce — delivered automatically, skippable anytime. Save up to 15% on every order.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full h-14 px-9 text-base bg-[#e8c97e] hover:bg-[#d4b566] text-[#1B2E1F] border-0 font-bold" asChild>
                  <Link href="/boxes">Explore Boxes <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
                {["Save up to 15%", "Skip or cancel anytime", "Eco-friendly packaging"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-white/60 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#e8c97e]" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-4 shrink-0">
              {[
                { name: "Harvest Box", price: "₹499/wk", items: "8–10 seasonal items" },
                { name: "Family Feast", price: "₹799/wk", items: "14–16 seasonal items" },
                { name: "Oils & Grains", price: "₹649/mo", items: "Cold-pressed oils + grains" },
              ].map(({ name, price, items }) => (
                <div key={name} className="bg-white/8 border border-white/12 rounded-2xl px-6 py-4 w-64">
                  <div className="font-semibold text-white mb-0.5">{name}</div>
                  <div className="text-[#e8c97e] font-bold">{price}</div>
                  <div className="text-white/50 text-xs mt-1">{items}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
