import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, X, Loader2, Sparkles, ArrowRight, Plus, Check, ShieldCheck, Zap } from "lucide-react";
import { useListProducts, useAddToCart, getGetCartQueryKey, getListProductsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FALLBACK_PRODUCTS } from "@/lib/fallbackCatalog";

const TRENDING_SEARCHES = [
  "Bull-Driven Groundnut Oil",
  "A2 Bilona Cow Ghee",
  "Wood-Pressed Mustard Oil",
  "Wild Forest Raw Honey",
  "Virgin Coconut Oil",
  "Khapli Emmer Wheat",
  "Devgad Alphonso Mangoes",
  "Organic Jaggery Powder",
];

const POPULAR_CATEGORIES = [
  { name: "Bull-Driven Oils", slug: "oils", icon: "🏺" },
  { name: "A2 Desi Ghee", slug: "gau-products", icon: "🐄" },
  { name: "Raw Honey & Sweeteners", slug: "sweetener", icon: "🍯" },
  { name: "Millets & Flours", slug: "millets", icon: "🌾" },
];

export function PredictiveSearch({ onSelect }: { onSelect?: () => void }) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const addToCartMutation = useAddToCart();
  const [addingId, setAddingId] = useState<number | null>(null);

  // Debounce search input by 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchParams = debouncedQuery ? { search: debouncedQuery } : undefined;
  const { data: searchResults, isLoading: isSearchLoading } = useListProducts(
    searchParams,
    {
      query: {
        enabled: debouncedQuery.length >= 2,
        queryKey: getListProductsQueryKey(searchParams),
      },
    }
  );

  const results = React.useMemo(() => {
    if (Array.isArray(searchResults) && searchResults.length > 0) {
      return searchResults;
    }
    if (debouncedQuery.length >= 2) {
      const q = debouncedQuery.toLowerCase();
      return FALLBACK_PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return [];
  }, [searchResults, debouncedQuery]);

  const isLoading = isSearchLoading && results.length === 0;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    if (onSelect) onSelect();
    setLocation(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectTrending = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term);
    setIsOpen(false);
    if (onSelect) onSelect();
    setLocation(`/products?search=${encodeURIComponent(term)}`);
  };

  const handleQuickAdd = async (e: React.MouseEvent, productId: number, productName: string) => {
    e.stopPropagation();
    e.preventDefault();
    setAddingId(productId);
    try {
      await addToCartMutation.mutateAsync({
        data: { productId, quantity: 1 },
      });
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      toast({
        title: "Added to Cart",
        description: `1x ${productName} added to your basket.`,
      });
    } catch (err: any) {
      toast({
        title: "Could not add to cart",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsOpen(false);
              inputRef.current?.blur();
            }
          }}
          placeholder="Search Bull-Driven Oils, A2 Ghee, Honey, Millets..."
          className="w-full h-10 pl-10 pr-9 rounded-full bg-muted/70 hover:bg-muted focus:bg-background border border-border/70 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 text-xs sm:text-sm text-foreground transition-all shadow-xs"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Dropdown Container */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/80 rounded-2xl shadow-xl overflow-hidden z-50 text-left animate-in fade-in-50 zoom-in-95 duration-150">
          {/* STATE 1: Empty Query - Show Trending & Categories */}
          {debouncedQuery.length < 2 && (
            <div className="p-4 space-y-4">
              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Trending on Desiri</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_SEARCHES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSelectTrending(item)}
                      className="px-3 py-1.5 text-xs rounded-full bg-muted/60 hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 border border-border/50 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Categories */}
              <div className="border-t pt-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Browse by Category
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {POPULAR_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        if (onSelect) onSelect();
                      }}
                      className="flex items-center gap-2 p-2 rounded-xl border border-border/60 hover:border-emerald-600/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-xs transition-colors"
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="font-medium text-foreground truncate">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: Loading Search */}
          {debouncedQuery.length >= 2 && isLoading && (
            <div className="p-8 text-center text-muted-foreground text-xs flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              <span>Searching organic catalogue for "{debouncedQuery}"...</span>
            </div>
          )}

          {/* STATE 3: Results Found */}
          {debouncedQuery.length >= 2 && !isLoading && results.length > 0 && (
            <div className="max-h-[380px] overflow-y-auto divide-y divide-border/60">
              <div className="p-2.5 bg-muted/30 text-xs text-muted-foreground flex items-center justify-between font-medium">
                <span>Products matching "{debouncedQuery}"</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{results.length} found</span>
              </div>

              {results.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="p-3 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3"
                >
                  <Link
                    href={`/products/${product.id}`}
                    onClick={() => {
                      setIsOpen(false);
                      if (onSelect) onSelect();
                    }}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/60">
                      <img
                        src={product.imageUrl || "/images/hero.png"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-xs sm:text-sm text-foreground truncate hover:text-emerald-700 dark:hover:text-emerald-400">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          ₹{product.price.toFixed(2)}
                        </span>
                        <span>•</span>
                        <span>{product.unit}</span>
                        {product.freshnessScore && (
                          <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded font-medium">
                            <Zap className="h-2.5 w-2.5" /> {product.freshnessScore}%
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Quick Add Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={addingId === product.id}
                    onClick={(e) => handleQuickAdd(e, product.id, product.name)}
                    className="h-8 px-2.5 text-xs border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 shrink-0 rounded-lg"
                  >
                    {addingId === product.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add
                      </>
                    )}
                  </Button>
                </div>
              ))}

              {/* View all results button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full p-3 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View all {results.length} results for "{debouncedQuery}"</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* STATE 4: Zero Results */}
          {debouncedQuery.length >= 2 && !isLoading && results.length === 0 && (
            <div className="p-6 text-center space-y-3">
              <div className="text-xs text-muted-foreground">
                No items directly matching "<span className="font-semibold text-foreground">{debouncedQuery}</span>"
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSelectTrending("Groundnut Oil")}
                  className="text-xs h-7"
                >
                  Groundnut Oil
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSelectTrending("Cow Ghee")}
                  className="text-xs h-7"
                >
                  A2 Cow Ghee
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSelectTrending("Mustard Oil")}
                  className="text-xs h-7"
                >
                  Mustard Oil
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
