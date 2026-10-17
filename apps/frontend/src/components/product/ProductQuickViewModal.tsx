import React, { useState, useEffect } from "react";
import { Product, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { resolveProductImage } from "@/lib/productImages";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  X,
  Share2,
  ShoppingCart,
  Check,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  MessageCircle,
  RefreshCw,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickViewModal({
  product,
  isOpen,
  onClose,
}: ProductQuickViewModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const addToCartMutation = useAddToCart();

  // Reset quantity when opened for a new product
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setIsSubscribed(false);
    }
  }, [isOpen, product?.id]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // Pricing calculations
  const unitPrice = product.price;
  const rawTotalPrice = unitPrice * quantity;
  const discountRate = isSubscribed ? 0.05 : 0;
  const totalPrice = rawTotalPrice * (1 - discountRate);

  // Determine GST rate (5% for edible oils/grains, 12% for dairy/ghee/bodycare)
  const gstRate =
    product.categorySlug === "dairy" || product.categorySlug === "body-care"
      ? 0.12
      : 0.05;
  const gstLabel = `${(gstRate * 100).toFixed(0)}%`;

  // Base cost before tax
  const itemCost = totalPrice / (1 + gstRate);
  const taxAmount = totalPrice - itemCost;

  const handleDecrement = () => {
    setQuantity((prev) => {
      if (prev <= 0.5) return 0.5;
      if (prev === 1) return 0.5;
      return prev - 1;
    });
  };

  const handleIncrement = () => {
    setQuantity((prev) => {
      if (prev === 0.5) return 1;
      return prev + 1;
    });
  };

  const handleWhatsAppOrder = () => {
    const waNumber = "919480123456"; // Desiri Official WhatsApp
    const subText = isSubscribed ? " [Monthly Subscription (5% OFF)]" : "";
    const msg = `🌿 *New Order Request - Desiri Naturals*\n\n` +
      `Product: *${product.name}*\n` +
      `Quantity: *${quantity} × ${product.unit}*${subText}\n` +
      `Total: *₹${totalPrice.toFixed(2)}*\n\n` +
      `Please confirm farm dispatch to my address!`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/products/${product.id}` : "";
    const shareText = `🌿 *${product.name}* at Desiri Naturals\nPrice: ₹${totalPrice.toFixed(2)}\nOrder here: ${url}`;

    // 1. Native Web Share API (Mobile devices)
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      navigator
        .share({
          title: product.name,
          text: shareText,
          url: url,
        })
        .catch(() => {});
      return;
    }

    // 2. Modern Clipboard API (Requires HTTPS or localhost)
    if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopiedShare(true);
          toast({
            title: "Link Copied! 📋",
            description: "Product link copied to clipboard.",
          });
          setTimeout(() => setCopiedShare(false), 2500);
        })
        .catch(() => {
          // If writeText rejected, fallback to WhatsApp
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
        });
      return;
    }

    // 3. Fallback for non-secure / older browser environments
    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedShare(true);
      toast({
        title: "Link Copied! 📋",
        description: "Product link copied to clipboard.",
      });
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // 4. Ultimate fallback: open WhatsApp share
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    // Convert fractional quantity to integer ceiling for cart backend if needed, or send quantity
    const orderQty = Math.max(1, Math.round(quantity));
    addToCart(orderQty);
  };

  const addToCart = (qty: number) => {
    addToCartMutation.mutate(
      { data: { productId: product.id, quantity: qty } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({
            title: "Added to Cart! 🛒",
            description: `${quantity} × ${product.name} added to your basket.`,
          });
          setIsAdding(false);
          onClose();
        },
        onError: () => {
          toast({
            title: "Error adding to cart",
            description: "Please check your network and try again.",
            variant: "destructive",
          });
          setIsAdding(false);
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-card border border-border/80 rounded-3xl max-w-2xl w-full shadow-2xl relative overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Right Actions: Share & Close buttons */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={handleShare}
            className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Share Product"
          >
            {copiedShare ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center mt-2">
          {/* Left Column: Product Image in rounded container */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl bg-[#fafafa] dark:bg-muted/30 p-6 flex items-center justify-center aspect-square relative">
            <img
              src={resolveProductImage(product.imageUrl, product.name, product.categorySlug)}
              alt={product.name}
              className="max-h-56 sm:max-h-64 w-auto object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.dataset.fallback) { t.dataset.fallback = "1"; t.src = "/images/desiri-tin-can.png"; }
              }}
            />
            {product.isOrganic && (
              <span className="absolute top-3 left-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                100% Pure
              </span>
            )}
          </div>

          {/* Right Column: Title, Subtitle, Stepper, Price Breakdown & CTA */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <h2 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-foreground leading-snug">
                {product.name}
              </h2>

              {/* Product Badge Pill */}
              <div className="mt-1.5">
                <span className="inline-block bg-gray-100 dark:bg-muted text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-md font-medium">
                  {product.name}
                </span>
              </div>

              {/* Subtitle / Description */}
              <p className="text-xs text-gray-500 dark:text-muted-foreground mt-2 leading-relaxed">
                {product.description || "Premium quality product"}
              </p>
            </div>

            {/* Quantity Stepper */}
            <div>
              <label className="text-xs font-semibold text-gray-900 dark:text-foreground block mb-1.5">
                Quantity
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all text-sm font-bold"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <div className="w-14 h-8 border border-gray-200 dark:border-gray-700 rounded-lg text-center text-sm font-bold text-gray-800 dark:text-foreground flex items-center justify-center bg-white dark:bg-muted/40">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all text-sm font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs text-gray-500 ml-2">
                  × {product.unit}
                </span>
              </div>
            </div>

            {/* Subscribe & Save 5% Toggle */}
            <div 
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`cursor-pointer rounded-xl border p-2.5 flex items-center justify-between text-xs transition-all ${
                isSubscribed 
                  ? "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300"
                  : "border-gray-200 dark:border-border hover:bg-muted/40 text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <RefreshCw className={`h-4 w-4 ${isSubscribed ? "text-emerald-700 animate-spin-reverse" : ""}`} />
                <div>
                  <span className="font-bold text-foreground">Subscribe & Save 5%</span>
                  <span className="block text-[11px] text-muted-foreground">Auto-delivered fresh every 30 days. Cancel anytime.</span>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                isSubscribed ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"
              }`}>
                {isSubscribed && <Check className="h-2.5 w-2.5" />}
              </div>
            </div>

            {/* Price Breakdown Box matching Image 2 */}
            <div className="bg-[#f8faf9] dark:bg-muted/20 border border-gray-100 dark:border-border/60 rounded-xl p-3.5 space-y-1.5">
              <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                <span>Item Cost</span>
                <span className="font-mono">₹{itemCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                <span>Tax ({gstLabel})</span>
                <span className="font-mono">₹{taxAmount.toFixed(2)}</span>
              </div>
              {isSubscribed && (
                <div className="flex justify-between items-center text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>Subscription Savings (5%)</span>
                  <span>-₹{(rawTotalPrice * 0.05).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200/60 dark:border-border/60 pt-2 flex justify-between items-center">
                <span className="font-bold text-sm text-gray-900 dark:text-foreground">
                  Price
                </span>
                <span className="font-bold text-2xl text-[#1b7a42] dark:text-emerald-400 font-sans">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Purity Guarantee Badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-lg">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Lab Certified Pure
              </span>
              <span className="flex items-center gap-1">
                <Leaf className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Zero Hexane/Solvents
              </span>
            </div>

            {/* CTA Buttons: Add to Cart & Instant WhatsApp Order */}
            <div className="space-y-2">
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-[#196b37] hover:bg-[#145a2e] text-white font-semibold py-3 rounded-xl shadow-xs flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.99] h-12"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart • ₹{totalPrice.toFixed(2)}
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white font-semibold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs transition-all active:scale-[0.99] h-10"
              >
                <MessageCircle className="h-4 w-4" />
                Quick Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
