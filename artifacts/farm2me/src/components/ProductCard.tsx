import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Star, Leaf, Loader2 } from "lucide-react";
import { Product } from "@workspace/api-client-react";
import { useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add to cart. Please try again.",
            variant: "destructive",
          });
        },
        onSettled: () => {
          setIsAdding(false);
        }
      }
    );
  };

  return (
    <Link href={`/products/${product.id}`} className="group relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/20">
            <Leaf className="h-12 w-12 text-secondary/40" />
          </div>
        )}
        
        <div className="absolute left-2 top-2 flex flex-col gap-1.5">
          {product.isOrganic && (
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground shadow-sm">
              Organic
            </Badge>
          )}
          {product.isSeasonal && (
            <Badge variant="outline" className="bg-background/90 backdrop-blur text-foreground border-transparent shadow-sm">
              Seasonal
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex justify-between items-start mb-1">
          <p className="text-sm font-medium text-muted-foreground line-clamp-1">{product.farmName}</p>
          <div className="flex items-center text-sm font-medium">
            <Star className="h-3.5 w-3.5 fill-primary text-primary mr-1" />
            <span>{product.rating > 0 ? product.rating.toFixed(1) : "New"}</span>
          </div>
        </div>
        
        <h3 className="font-serif text-lg font-bold leading-tight tracking-tight text-foreground line-clamp-2 mb-2">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold">₹{product.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">per {product.unit}</span>
          </div>
          
          <Button 
            size="sm" 
            className="rounded-full" 
            onClick={handleAddToCart}
            disabled={isAdding || product.stock <= 0}
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </Link>
  );
}
