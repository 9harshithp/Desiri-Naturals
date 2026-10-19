import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { 
  useListProducts, 
  useListCategories,
  ListProductsSort,
  Product 
} from "@workspace/api-client-react";
import { FALLBACK_PRODUCTS } from "@/lib/fallbackCatalog";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, Sparkles, Truck, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Authentic Desiri Product Divisions from PDF Price List
const CATEGORY_TABS = [
  { label: "All Produce", slug: undefined },
  { label: "Bull-Driven Oils", slug: "oils" },
  { label: "A2 Desi Ghee & Gau", slug: "gau-products" },
  { label: "Millets", slug: "millets" },
  { label: "Grains & Pulses", slug: "cereals-grains" },
  { label: "Sweeteners & Honey", slug: "sweetener" },
  { label: "Body Care", slug: "body-care" },
  { label: "Spices", slug: "spices" },
  { label: "Snacks", slug: "snacks" },
  { label: "Single Herbs & Pooja", slug: "pooja-items" },
  { label: "Cattle Feed", slug: "cattle-feed" },
  { label: "Fruits & Vegetables", slug: "fruits-vegetables" },
  { label: "Healthy Drinks", slug: "healthy-drinks" },
  { label: "Utensils & Vessels", slug: "others" },
];

export default function Products() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();

  const searchParams = useMemo(() => new URLSearchParams(searchString), [searchString]);

  // Normalize category from URL, accepting both canonical slugs and common aliases
  const rawCategory = searchParams.get("category") || undefined;
  const category = useMemo(() => {
    if (!rawCategory) return undefined;
    if (rawCategory === "cold-pressed-oils" || rawCategory === "cooking-oil") return "oils";
    if (rawCategory === "dairy") return "gau-products";
    if (rawCategory === "natural-sweeteners") return "sweetener";
    if (rawCategory === "grains-millets") return "millets";
    return rawCategory;
  }, [rawCategory]);

  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("search") || "");
  const [isOrganic, setIsOrganic] = useState(false);
  const [isSeasonal, setIsSeasonal] = useState(() => searchParams.get("seasonal") === "true");
  const [sort, setSort] = useState<ListProductsSort | undefined>(undefined);

  // Sync state if search param or seasonal param changes in URL
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch(urlSearch);
    setDebouncedSearch(urlSearch);
    setIsSeasonal(searchParams.get("seasonal") === "true");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: categories } = useListCategories();
  const { data: products, isLoading } = useListProducts({
    search: debouncedSearch || undefined,
    category,
    organic: isOrganic || undefined,
    seasonal: isSeasonal || undefined,
    sort
  });

  const displayedProducts = useMemo(() => {
    let list: Product[] = [];
    if (Array.isArray(products) && products.length > 0) {
      list = [...products];
    } else {
      list = [...FALLBACK_PRODUCTS];
      if (category) {
        list = list.filter((p) => p.categorySlug === category);
      }
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
      }
      if (isOrganic) {
        list = list.filter((p) => p.isOrganic);
      }
      if (isSeasonal) {
        list = list.filter((p) => p.isSeasonal);
      }
      if (sort === "price_asc") {
        list.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sort === "price_desc") {
        list.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (sort === "rating") {
        list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      }
    }
    return list;
  }, [products, category, debouncedSearch, isOrganic, isSeasonal, sort]);

  const handleTabClick = (slug?: string) => {
    const nextParams = new URLSearchParams(searchString);
    if (slug) {
      nextParams.set("category", slug);
    } else {
      nextParams.delete("category");
    }
    const queryString = nextParams.toString();
    setLocation(queryString ? `/products?${queryString}` : "/products");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="h-4 w-4" /> Desiri Authentic Harvest Catalog
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Desiri Product Price List
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
            100% Traditional Bull-Driven Wood Cold-Pressed Oils (2-3 RPM), Vedic A2 Ghee, Unpolished Millets & Heritage Essentials.
          </p>
        </div>

        {/* Free Home Delivery Notice Pill */}
        <div className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-4 py-2.5 rounded-2xl shrink-0">
          <Truck className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">Free Home Delivery</span>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Bengaluru, Mysuru, Tumkur & Statewide</p>
          </div>
        </div>
      </div>

      {/* ── HORIZONTAL CATEGORY PILLS BAR ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none scroll-smooth">
          {CATEGORY_TABS.map((tab) => {
            const isActive = category === tab.slug;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => handleTabClick(tab.slug)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 border ${
                  isActive
                    ? "border-emerald-600 bg-emerald-700 text-white shadow-xs"
                    : "border-gray-200 dark:border-gray-800 bg-white dark:bg-card text-gray-700 dark:text-gray-300 hover:border-emerald-500/60 hover:text-emerald-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SEARCH, FILTER & SORT BAR ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-muted/20 border border-border/60 p-3 sm:p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search oils, millets, spices, prices..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10 text-xs sm:text-sm bg-background border-border/80 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Showing <strong className="text-foreground">{displayedProducts.length}</strong> products
          </span>

          <Select value={sort || "newest"} onValueChange={(val) => setSort(val as ListProductsSort)}>
            <SelectTrigger className="w-[160px] h-10 text-xs rounded-xl bg-background border-border/80">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Featured & New</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── MAIN PRODUCT FLASHCARD GRID (Matching Image 1) ────────── */}
      {isLoading && displayedProducts.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col rounded-2xl border bg-card overflow-hidden p-4 space-y-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border p-8">
          <p className="text-base font-semibold text-foreground mb-1">No products found in this category</p>
          <p className="text-xs text-muted-foreground mb-6">Try selecting "All" or searching for a different item.</p>
          <Button 
            onClick={() => { handleTabClick(undefined); setSearch(""); }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs px-6"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
