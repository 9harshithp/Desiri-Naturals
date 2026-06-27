import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Star, Leaf, Loader2, Plus } from "lucide-react";
import { Product } from "@workspace/api-client-react";
import { useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const addToCart = useAddToCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({ title: "Added to cart", description: `${product.name} added.` });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to add to cart.", variant: "destructive" });
        },
        onSettled: () => setIsAdding(false),
      }
    );
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-card border border-border hover:border-[#C4602A]/40 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1B2E1F]/10 to-[#1B2E1F]/5">
            <Leaf className="h-10 w-10 text-[#1B2E1F]/20" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isOrganic && (
            <span className="bg-[#1B2E1F] text-white text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full">
              Organic
            </span>
          )}
          {product.isSeasonal && (
            <span className="bg-white/90 backdrop-blur text-foreground text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full">
              In Season
            </span>
          )}
        </div>

        {/* Add to cart — floats on hover */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock <= 0}
          className="absolute right-3 bottom-3 h-9 w-9 rounded-full bg-[#C4602A] text-white flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-[#a84e22] disabled:opacity-50"
          aria-label="Add to cart"
        >
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col p-4 gap-1 flex-1">
        <p className="text-xs font-medium text-muted-foreground tracking-wide truncate">{product.farmName}</p>
        <h3 className="font-serif text-base font-bold leading-snug text-foreground line-clamp-2 flex-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
          <div>
            <span className="font-bold text-foreground">₹{product.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground ml-1">/ {product.unit}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-[#C4602A] text-[#C4602A]" />
            <span>{product.rating > 0 ? product.rating.toFixed(1) : "—"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
