import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Leaf, ShieldCheck, Clock, MapPin, Search, Truck } from "lucide-react";
import { 
  useListFeaturedProducts, 
  useListCategories, 
  useGetDiscoverSummary,
  useListFarms
} from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: featuredProducts } = useListFeaturedProducts();
  const { data: categories } = useListCategories();
  const { data: summary } = useGetDiscoverSummary();
  const { data: farms } = useListFarms();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center bg-muted overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/hero.png" 
            alt="Fresh farm produce" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 bg-background/50 backdrop-blur border-primary text-primary px-3 py-1">
              Farm-to-table delivery in India
            </Badge>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Real food, grown by real people.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              Trace every tomato back to the farm it grew on. We connect conscious consumers directly with local farmers for fresh, organic produce delivered within 24 hours of harvest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full text-base px-8 h-14" asChild>
                <Link href="/products">Shop Fresh Produce</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-14 bg-background/50 backdrop-blur" asChild>
                <Link href="/farms">Meet Our Farmers</Link>
              </Button>
            </div>
            
            {summary && (
              <div className="mt-12 flex items-center gap-8 text-sm font-medium">
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold text-primary">{summary.totalFarms}+</span>
                  <span className="text-muted-foreground">Partner Farms</span>
                </div>
                <div className="h-10 w-px bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold text-secondary">{summary.organicPercentage}%</span>
                  <span className="text-muted-foreground">Organic Certified</span>
                </div>
                <div className="h-10 w-px bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-serif font-bold text-foreground">&lt; {summary.avgDeliveryHours}h</span>
                  <span className="text-muted-foreground">Harvest to Home</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="py-12 border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold">Shop by Category</h2>
            <Link href="/products" className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories?.slice(0, 6).map((category) => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl border bg-card hover:border-primary transition-colors text-center"
              >
                <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/20">
                      <Leaf className="h-8 w-8 text-secondary/60" />
                    </div>
                  )}
                </div>
                <span className="font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Fresh from the fields</h2>
              <p className="text-muted-foreground text-lg">Hand-picked by our farmers this morning. Ready for your kitchen tomorrow.</p>
            </div>
            <Button variant="outline" className="rounded-full shrink-0" asChild>
              <Link href="/products">Shop all produce</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts?.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/50 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">How Desiri Naturals works</h2>
            <p className="text-muted-foreground text-lg">We've eliminated the middlemen so farmers earn more and you eat better.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border -z-10" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-background border shadow-sm flex items-center justify-center mb-6 text-primary">
                <Search className="h-10 w-10" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">1. You Choose</h3>
              <p className="text-muted-foreground">Browse fresh produce from local Indian farms. Order by 8 PM for next-day delivery.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-background border shadow-sm flex items-center justify-center mb-6 text-secondary">
                <Leaf className="h-10 w-10" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">2. Farmers Harvest</h3>
              <p className="text-muted-foreground">Our partner farmers harvest your order early morning, ensuring peak freshness.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-background border shadow-sm flex items-center justify-center mb-6 text-foreground">
                <Truck className="h-10 w-10" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">3. We Deliver</h3>
              <p className="text-muted-foreground">Your produce is delivered straight to your door in eco-friendly packaging.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-secondary" />
              <h4 className="font-bold">100% Traceable</h4>
              <p className="text-sm text-primary-foreground/80">Know exactly where your food comes from</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Leaf className="h-8 w-8 text-secondary" />
              <h4 className="font-bold">Organic Partners</h4>
              <p className="text-sm text-primary-foreground/80">Certified pesticide-free farming</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Clock className="h-8 w-8 text-secondary" />
              <h4 className="font-bold">24hr Farm-to-Home</h4>
              <p className="text-sm text-primary-foreground/80">Harvested today, delivered tomorrow</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MapPin className="h-8 w-8 text-secondary" />
              <h4 className="font-bold">Fair to Farmers</h4>
              <p className="text-sm text-primary-foreground/80">Farmers set their own prices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden bg-muted flex flex-col lg:flex-row relative">
            <div className="absolute inset-0 bg-secondary/10 lg:w-1/2" />
            <div className="w-full lg:w-1/2 p-8 md:p-16 relative z-10 flex flex-col justify-center">
              <Badge className="w-fit mb-6 bg-secondary text-secondary-foreground hover:bg-secondary">
                Desiri Naturals Boxes
              </Badge>
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-foreground">
                Let the seasons decide your menu.
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Subscribe to our curated weekly or bi-weekly farm boxes. Get a seasonal mix of fresh vegetables, fruits, and greens delivered automatically.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="rounded-full bg-secondary/20 p-1">
                    <Check className="h-4 w-4 text-secondary" />
                  </div>
                  <span>Save up to 15% compared to individual items</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="rounded-full bg-secondary/20 p-1">
                    <Check className="h-4 w-4 text-secondary" />
                  </div>
                  <span>Customize what goes in your box</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="rounded-full bg-secondary/20 p-1">
                    <Check className="h-4 w-4 text-secondary" />
                  </div>
                  <span>Pause or cancel anytime</span>
                </li>
              </ul>
              <Button size="lg" className="rounded-full w-fit h-14 px-8 text-base" asChild>
                <Link href="/boxes">Explore Subscription Boxes</Link>
              </Button>
            </div>
            <div className="w-full lg:w-1/2 h-[400px] lg:h-auto relative">
              <img 
                src="/images/box.png" 
                alt="Desiri Naturals Subscription Box" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HomeBadge({ children, className, variant, ...props }: any) {
  return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>{children}</div>;
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
