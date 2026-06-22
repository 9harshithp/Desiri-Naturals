import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetProduct, useListProductReviews, useListProducts, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, MapPin, Star, ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { data: product, isLoading } = useGetProduct(id, { query: { enabled: !!id } });
  const { data: reviews } = useListProductReviews(id, { query: { enabled: !!id } });
  
  // Use product category for related items
  const { data: relatedProducts } = useListProducts(
    { category: product?.categorySlug },
    { query: { enabled: !!product?.categorySlug } }
  );

  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (isLoading) return <div className="p-12 text-center">Loading product...</div>;
  if (!product) return <div className="p-12 text-center">Product not found</div>;

  const handleAddToCart = () => {
    addToCart.mutate(
      { data: { productId: product.id, quantity } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({
            title: "Added to cart",
            description: `${quantity}x ${product.name} added to your cart.`,
          });
        }
      }
    );
  };

  const filteredRelated = relatedProducts?.filter(p => p.id !== product.id).slice(0, 4) || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to all produce
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
        <div className="aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-muted border">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/10">
              <Leaf className="h-24 w-24 text-secondary/40" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex gap-2 mb-4">
            {product.isOrganic && (
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-sm py-1 px-3">
                Organic Certified
              </Badge>
            )}
            {product.isSeasonal && (
              <Badge variant="outline" className="text-sm py-1 px-3 bg-muted/50 border-primary/20">
                In Season
              </Badge>
            )}
          </div>

          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 text-sm">
            <Link href={`/farms/${product.farmId}`} className="font-medium text-primary hover:underline flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {product.farmName}
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center text-amber-500 font-medium">
              <Star className="h-4 w-4 fill-current mr-1" />
              {product.rating > 0 ? product.rating.toFixed(1) : "No ratings yet"} 
              <span className="text-muted-foreground ml-1 font-normal">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="text-3xl font-bold mb-8">
            ₹{product.price.toFixed(2)} <span className="text-base font-normal text-muted-foreground">per {product.unit}</span>
          </div>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {product.description || `Fresh ${product.name.toLowerCase()} sourced directly from ${product.farmName}. Harvested at peak ripeness for optimal flavor and nutrition.`}
          </p>

          <div className="bg-muted/50 border rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-4 bg-background border rounded-full px-2 py-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-medium w-6 text-center text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Total: ₹{(product.price * quantity).toFixed(2)}
              </span>
            </div>

            <Button 
              size="lg" 
              className="w-full rounded-full h-14 text-lg" 
              onClick={handleAddToCart}
              disabled={addToCart.isPending || product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> 
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
              <Leaf className="h-4 w-4 text-primary" /> Freshness guaranteed
            </p>
          </div>
        </div>
      </div>

      {filteredRelated.length > 0 && (
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-bold mb-8">More from this category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredRelated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-serif text-3xl font-bold mb-8 border-b pb-4">Customer Reviews</h2>
        {reviews && reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-medium">{review.reviewerName}</div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-muted stroke-muted-foreground/30'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
                <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
}
