import { useState } from "react";
import { Link } from "wouter";
import {
  useGetProduct, useListProductReviews, useListProducts,
  useAddToCart, useCreateProductReview,
  getGetCartQueryKey, getListProductReviewsQueryKey,
  getGetProductQueryKey, getListProductsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Leaf, MapPin, Star, ShoppingCart, Plus, Minus, ArrowLeft, Zap,
  ShieldCheck, Award, MessageCircle, RefreshCw, CheckCircle2, Check, Truck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/ProductCard";
import { resolveProductImage } from "@/lib/productImages";
import { usePincode } from "@/context/pincode-context";

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
  const { data: product, isLoading } = useGetProduct(id, {
    query: {
      enabled: !!id,
      queryKey: getGetProductQueryKey(id),
    },
  });
  const { data: reviews } = useListProductReviews(id, {
    query: {
      enabled: !!id,
      queryKey: getListProductReviewsQueryKey(id),
    },
  });
  const { data: relatedProducts } = useListProducts(
    { category: product?.categorySlug },
    {
      query: {
        enabled: !!product?.categorySlug,
        queryKey: getListProductsQueryKey({ category: product?.categorySlug }),
      },
    }
  );

  const [quantity, setQuantity] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const { pincodeData, openModal } = usePincode();
  const addToCart = useAddToCart();
  const createReview = useCreateProductReview();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (isLoading) return <div className="p-12 text-center text-muted-foreground font-medium">Loading product...</div>;
  if (!product) return <div className="p-12 text-center text-muted-foreground font-medium">Product not found</div>;

  const rawPrice = product.price;
  const effectivePrice = isSubscribed ? rawPrice * 0.95 : rawPrice;
  const totalPrice = effectivePrice * quantity;

  const handleAddToCart = () => {
    addToCart.mutate(
      { data: { productId: product.id, quantity } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({ 
            title: isSubscribed ? "Subscribed to Monthly Delivery! 📦" : "Added to Cart 🛒", 
            description: `${quantity}× ${product.name} ${isSubscribed ? "(Monthly Delivery 5% OFF)" : ""} added to your basket.` 
          });
        },
      }
    );
  };

  const handleWhatsAppOrder = () => {
    const waNumber = "919480123456";
    const subText = isSubscribed ? " [Monthly Subscription (5% OFF)]" : "";
    const msg = `🌿 *Direct Order - Desiri Naturals*\n\n` +
      `Product: *${product.name}*\n` +
      `Quantity: *${quantity} × ${product.unit}*${subText}\n` +
      `Price: *₹${totalPrice.toFixed(2)}*\n` +
      `Delivery PIN: *${pincodeData.pincode} (${pincodeData.city})*\n\n` +
      `Please confirm farm packing and dispatch date!`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
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
          toast({ title: "Review submitted! Thank you for sharing your experience." });
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

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
        {/* Left Column: Smart Branded Product Image */}
        <div className="aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-[#fafafa] dark:bg-muted/20 border p-8 flex items-center justify-center relative shadow-xs">
          <img
            src={resolveProductImage(product.imageUrl, product.name, product.categorySlug)}
            alt={product.name}
            className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              const t = e.currentTarget;
              if (!t.dataset.fallback) {
                t.dataset.fallback = "1";
                t.src = "/images/desiri-tin-can.png";
              }
            }}
          />
          {product.isOrganic && (
            <span className="absolute top-4 left-4 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              🌿 100% Mara Chekku Pure
            </span>
          )}
        </div>

        {/* Right Column: Info & Commerce Actions */}
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            {product.isOrganic && (
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs py-0.5 px-2.5">
                Cold Pressed Under 40°C
              </Badge>
            )}
            {product.isSeasonal && (
              <Badge variant="outline" className="text-xs py-0.5 px-2.5 bg-muted/50">
                Fresh Farm Harvest
              </Badge>
            )}
            <Badge variant="outline" className="text-xs py-0.5 px-2.5 bg-amber-50 text-amber-800 border-amber-200">
              Zero Chemical Refining
            </Badge>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4 text-sm">
            <Link href={`/farms/${product.farmId}`} className="font-medium text-emerald-700 hover:underline flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {product.farmName || "Karnataka Heritage Farms"}
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center text-amber-500 font-medium">
              <Star className="h-4 w-4 fill-current mr-1" />
              {product.rating > 0 ? product.rating.toFixed(1) : "4.9"}
              <span className="text-muted-foreground ml-1 font-normal">({product.reviewCount || 18} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 font-sans">
              ₹{effectivePrice.toFixed(2)}
            </span>
            {isSubscribed && (
              <span className="text-base line-through text-muted-foreground font-mono">
                ₹{rawPrice.toFixed(2)}
              </span>
            )}
            <span className="text-sm font-normal text-muted-foreground">per {product.unit}</span>
            {isSubscribed && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                5% Monthly Savings Applied
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {product.description ||
              `Traditional wood-pressed ${product.name.toLowerCase()} sourced directly from native ${product.farmName || "Desiri Farms"}. Extracted at low temperature below 40°C in wooden Waghai/Mara Chekku to retain 100% natural antioxidants, aroma, and rich nutrients.`}
          </p>

          {/* PINCODE LIVE ESTIMATOR CARD */}
          <div className="bg-muted/30 border rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  Delivery to {pincodeData.pincode} ({pincodeData.city})
                </p>
                <p className="text-xs text-muted-foreground">
                  {pincodeData.deliveryPromise} • {pincodeData.shippingFee === 0 ? "Free Shipping" : `₹${pincodeData.shippingFee}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openModal}
              className="text-xs font-semibold text-emerald-700 hover:underline px-2 py-1"
            >
              Change
            </button>
          </div>

          {/* FRESHNESS & PURITY SCORE */}
          <div className="bg-muted/40 border rounded-2xl p-4 mb-6">
            <FreshnessBar score={product.freshnessScore || 92} />
          </div>

          {/* SUBSCRIBE & SAVE 5% TOGGLE */}
          <div
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`cursor-pointer rounded-2xl border p-4 mb-6 flex items-center justify-between transition-all ${
              isSubscribed
                ? "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-600/20"
                : "border-gray-200 dark:border-border hover:bg-muted/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <RefreshCw className={`h-4 w-4 ${isSubscribed ? "animate-spin-reverse" : ""}`} />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-foreground">
                  Subscribe & Save 5% Every Month
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  Never run out of pure staples. Delivered automatically every 30 days. Cancel anytime.
                </span>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
              isSubscribed ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"
            }`}>
              {isSubscribed && <Check className="h-3 w-3" />}
            </div>
          </div>

          {/* ADD TO CART & COMMERCE CONTROLS */}
          <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 bg-muted rounded-full px-3 py-1.5 border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:bg-background rounded-full transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold w-6 text-center text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:bg-background rounded-full transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Order Total</span>
                <span className="text-2xl font-bold text-foreground font-sans">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <Button
                size="lg"
                className="w-full bg-[#196b37] hover:bg-[#145a2e] text-white rounded-xl h-12 text-sm font-semibold shadow-xs"
                onClick={handleAddToCart}
                disabled={addToCart.isPending || product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {addToCart.isPending ? "Adding..." : (product.stock > 0 ? "Add to Cart" : "Out of Stock")}
              </Button>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white font-semibold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 text-sm transition-all h-12"
              >
                <MessageCircle className="h-4 w-4" />
                Order via WhatsApp
              </button>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t text-[11px] text-muted-foreground text-center">
              <span className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-emerald-700" /> Mara Chekku Pressed
              </span>
              <span className="flex flex-col items-center gap-1">
                <Leaf className="h-4 w-4 text-emerald-700" /> Zero Chemical Refining
              </span>
              <span className="flex flex-col items-center gap-1">
                <Award className="h-4 w-4 text-emerald-700" /> FSSAI Certified Pure
              </span>
            </div>
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
