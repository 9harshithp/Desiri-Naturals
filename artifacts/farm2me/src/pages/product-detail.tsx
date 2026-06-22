import { useState } from "react";
import { Link } from "wouter";
import {
  useGetProduct, useListProductReviews, useListProducts,
  useAddToCart, useCreateProductReview,
  getGetCartQueryKey, getListProductReviewsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Leaf, MapPin, Star, ShoppingCart, Plus, Minus, ArrowLeft, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/ProductCard";

function FreshnessBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-primary" : score >= 60 ? "bg-amber-500" : "bg-destructive";
  const label = score >= 85 ? "Peak Freshness" : score >= 70 ? "Very Fresh" : score >= 55 ? "Good" : "Use Soon";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 font-medium">
          <Zap className="h-4 w-4 text-amber-500" />
          Freshness Score
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">{score}/100</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            score >= 80 ? "bg-primary/10 text-primary" : score >= 60 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
          }`}>{label}</span>
        </div>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Harvested within the last {score >= 85 ? "24 hours" : score >= 70 ? "48 hours" : "72 hours"}. Best consumed within {score >= 85 ? "3-5" : score >= 70 ? "5-7" : "7-10"} days.
      </p>
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              i <= (hover || value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { data: product, isLoading } = useGetProduct(id, { query: { enabled: !!id } });
  const { data: reviews } = useListProductReviews(id, { query: { enabled: !!id } });
  const { data: relatedProducts } = useListProducts(
    { category: product?.categorySlug },
    { query: { enabled: !!product?.categorySlug } }
  );

  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const addToCart = useAddToCart();
  const createReview = useCreateProductReview();
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
          toast({ title: "Added to cart", description: `${quantity}× ${product.name} added.` });
        },
      }
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      toast({ title: "Please enter your name", variant: "destructive" });
      return;
    }
    createReview.mutate(
      { id: product.id, data: { rating: reviewRating, reviewerName: reviewerName.trim(), comment: reviewComment } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductReviewsQueryKey(id) });
          toast({ title: "Review submitted!" });
          setReviewerName("");
          setReviewComment("");
          setReviewRating(5);
        },
      }
    );
  };

  const filteredRelated = relatedProducts?.filter((p) => p.id !== product.id).slice(0, 4) || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to all produce
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
        {/* Image */}
        <div className="aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-muted border">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/10">
              <Leaf className="h-24 w-24 text-secondary/40" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4">
            {product.isOrganic && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-sm py-1 px-3">
                Organic Certified
              </Badge>
            )}
            {product.isSeasonal && (
              <Badge variant="outline" className="text-sm py-1 px-3 bg-muted/50">
                In Season
              </Badge>
            )}
            {product.badges?.map((badge) => (
              <Badge key={badge} variant="outline" className="text-sm py-1 px-3">{badge}</Badge>
            ))}
          </div>

          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4 text-sm">
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

          <div className="text-3xl font-bold mb-6">
            ₹{product.price.toFixed(2)}{" "}
            <span className="text-base font-normal text-muted-foreground">per {product.unit}</span>
          </div>

          <p className="text-base text-muted-foreground mb-6 leading-relaxed">
            {product.description ||
              `Fresh ${product.name.toLowerCase()} sourced directly from ${product.farmName}. Harvested at peak ripeness for optimal flavour and nutrition.`}
          </p>

          {/* Freshness score */}
          <div className="bg-muted/40 border rounded-2xl p-5 mb-6">
            <FreshnessBar score={product.freshnessScore} />
          </div>

          {/* Add to cart */}
          <div className="bg-muted/50 border rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center gap-3 bg-background border rounded-full px-3 py-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 hover:bg-muted rounded-full transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold w-6 text-center text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 hover:bg-muted rounded-full transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Total: <span className="text-foreground font-bold">₹{(product.price * quantity).toFixed(2)}</span>
              </span>
            </div>

            <Button
              size="lg"
              className="w-full rounded-full h-13 text-base"
              onClick={handleAddToCart}
              disabled={addToCart.isPending || product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>

            {product.stock > 0 && product.stock < 20 && (
              <p className="text-center text-xs text-amber-600 mt-3 font-medium">
                Only {product.stock} left in stock — order soon
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
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

      {/* Reviews */}
      <div>
        <h2 className="font-serif text-3xl font-bold mb-8 border-b pb-4">
          Customer Reviews
          {reviews && reviews.length > 0 && (
            <span className="text-lg font-normal text-muted-foreground ml-3">({reviews.length})</span>
          )}
        </h2>

        {reviews && reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold">{review.reviewerName}</div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>}
                <div className="text-xs text-muted-foreground mt-4 pt-3 border-t">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic mb-10">No reviews yet. Be the first!</p>
        )}

        {/* Write review */}
        <div className="bg-muted/30 border rounded-2xl p-6 max-w-xl">
          <h3 className="font-bold text-lg mb-5">Leave a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Your Rating</label>
              <StarPicker value={reviewRating} onChange={setReviewRating} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Your Name</label>
              <Input
                placeholder="Priya S."
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Comment (optional)</label>
              <Textarea
                placeholder="What did you think of this product?"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="bg-background resize-none min-h-[90px]"
              />
            </div>
            <Button type="submit" disabled={createReview.isPending} className="rounded-full">
              {createReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
