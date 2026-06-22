import { useState } from "react";
import { useLocation } from "wouter";
import { 
  useListProducts, 
  useListCategories,
  ListProductsSort 
} from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Products() {
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const defaultCategory = searchParams.get("category") || undefined;
  const defaultSeasonal = searchParams.get("seasonal") === "true";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(defaultCategory);
  const [isOrganic, setIsOrganic] = useState(false);
  const [isSeasonal, setIsSeasonal] = useState(defaultSeasonal);
  const [sort, setSort] = useState<ListProductsSort | undefined>(undefined);

  // Simple debounce for search
  import("react").then((React) => {
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(search);
      }, 500);
      return () => clearTimeout(timer);
    }, [search]);
  });

  const { data: categories } = useListCategories();
  const { data: products, isLoading } = useListProducts({
    search: debouncedSearch || undefined,
    category,
    organic: isOrganic || undefined,
    seasonal: isSeasonal || undefined,
    sort
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Fresh Produce</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Everything here was harvested recently from our partner farms. Support local agriculture by buying direct.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="space-y-4">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Search className="h-4 w-4" /> Search
            </h3>
            <Input 
              placeholder="Search products, farms..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4" /> Categories
            </h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setCategory(undefined)}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${!category ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
              >
                All Produce
              </button>
              {categories?.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => setCategory(cat.slug)}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${category === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  {cat.name} <span className="text-xs ml-1 opacity-60">({cat.productCount})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h3>
            <div className="space-y-4 rounded-xl border p-4 bg-card">
              <div className="flex items-center justify-between">
                <Label htmlFor="organic-filter" className="cursor-pointer">Organic Only</Label>
                <Switch 
                  id="organic-filter" 
                  checked={isOrganic} 
                  onCheckedChange={setIsOrganic} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="seasonal-filter" className="cursor-pointer">In Season Now</Label>
                <Switch 
                  id="seasonal-filter" 
                  checked={isSeasonal} 
                  onCheckedChange={setIsSeasonal} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{products?.length || 0}</span> products
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium whitespace-nowrap">Sort by:</span>
              <Select value={sort || "newest"} onValueChange={(val) => setSort(val as ListProductsSort)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Newest Arrivals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col rounded-xl border bg-card overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex justify-between pt-4">
                      <Skeleton className="h-8 w-1/4" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl border-dashed bg-muted/30">
              <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-serif text-2xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                We couldn't find any produce matching your current filters. Try adjusting your search or category.
              </p>
              <Button onClick={() => {
                setSearch("");
                setCategory(undefined);
                setIsOrganic(false);
                setIsSeasonal(false);
                setSort(undefined);
              }}>Clear all filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
