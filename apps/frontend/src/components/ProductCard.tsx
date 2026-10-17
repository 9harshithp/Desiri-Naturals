import React, { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Eye, Loader2, Leaf, Zap, ShieldCheck } from "lucide-react";
import { Product, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ProductQuickViewModal } from "@/components/product/ProductQuickViewModal";
import { resolveProductImage } from "@/lib/productImages";
import { usePincode } from "@/context/pincode-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const addToCart = useAddToCart();
  const { pincodeData } = usePincode();
  const [isAdding, setIsAdding] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({
            title: "Added to Cart 🛒",
            description: `${product.name} added to your basket.`,
          });
        },
        onError: () => {
          toast({
            title: "Failed to add",
            description: "Please check your network and try again.",
            variant: "destructive",
          });
        },
        onSettled: () => setIsAdding(false),
      }
    );
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-card border border-gray-100 dark:border-border/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Top Image Container */}
        <div className="relative bg-[#f8f9fa] dark:bg-muted/30 aspect-square w-full flex items-center justify-center p-6 overflow-hidden">
          {/* Subtle Trust Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
              <Leaf className="h-2.5 w-2.5" /> Pure Desiri
            </span>
          </div>

          {/* Product Image — smart resolver picks best match per product type */}
          <Link href={`/products/${product.id}`} className="block h-full w-full flex items-center justify-center">
            <img
              src={resolveProductImage(product.imageUrl, product.name, product.categorySlug)}
              alt={product.name}
              className="max-h-48 h-48 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-xs"
              loading="lazy"
              onError={(e) => {
                const t = e.currentTarget;
                // Unsplash fallback chain → local tin can
                if (!t.dataset.fallback) {
                  t.dataset.fallback = "1";
                  t.src = "/images/desiri-tin-can.png";
                }
              }}
            />
          </Link>

          {/* Centered Floating Action Buttons (Eye for Quick View & Cart for Instant Add) - Appears on Hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 bg-black/5 dark:bg-black/20 backdrop-blur-[1px]">
            {/* Eye / Visible Icon Button */}
            <button
              type="button"
              onClick={handleOpenQuickView}
              className="pointer-events-none group-hover:pointer-events-auto h-11 w-11 rounded-full bg-white/95 dark:bg-card/95 hover:bg-white text-gray-700 dark:text-foreground hover:text-emerald-700 dark:hover:text-emerald-400 shadow-md border border-gray-100 dark:border-border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye className="h-5 w-5" />
            </button>

            {/* Shopping Cart Icon Button */}
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="pointer-events-none group-hover:pointer-events-auto h-11 w-11 rounded-full bg-white/95 dark:bg-card/95 hover:bg-white text-gray-700 dark:text-foreground hover:text-emerald-700 dark:hover:text-emerald-400 shadow-md border border-gray-100 dark:border-border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-60"
              title="Quick Add to Cart"
              aria-label="Add to cart"
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Card Body matching Image 1 */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-2 bg-white dark:bg-card">
          <Link href={`/products/${product.id}`} className="block group-hover:text-emerald-700 transition-colors">
            <h3 className="font-bold text-gray-900 dark:text-foreground text-sm sm:text-base leading-snug line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-muted-foreground line-clamp-1 mt-0.5">
              {product.unit} • {product.farmName || "Desiri Groves, Karnataka"}
            </p>
          </Link>

          {/* Bottom Row: Price on Left, Green Add to Cart on Right */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-border/60 mt-auto">
            <div>
              <span className="font-bold text-[#3f9e38] dark:text-emerald-400 text-lg sm:text-xl font-sans">
                ₹{product.price.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="bg-[#43a047] hover:bg-[#388e3c] active:bg-[#2e7d32] text-white font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:opacity-70"
            >
              {isAdding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShoppingCart className="h-3.5 w-3.5" />
              )}
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal Dialog */}
      {isQuickViewOpen && (
        <ProductQuickViewModal
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}
