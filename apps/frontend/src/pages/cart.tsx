import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetCart, useUpdateCartItem, useRemoveFromCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, 
  RefreshCw, Check, Zap, Truck, ShieldCheck, Sparkles 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePincode } from "@/context/pincode-context";
import { resolveProductImage } from "@/lib/productImages";

export default function Cart() {
  const [, setLocation] = useLocation();
  const { data: cart, isLoading } = useGetCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { pincodeData } = usePincode();
  const [isMonthlySubscribed, setIsMonthlySubscribed] = useState(false);

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem.mutate(
      { productId, data: { quantity: newQuantity } },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
      }
    );
  };

  const handleRemove = (productId: number) => {
    removeItem.mutate(
      { productId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast({ title: "Item removed from cart" });
        }
      }
    );
  };

  if (isLoading) return <div className="p-12 text-center text-muted-foreground font-medium">Loading basket...</div>;

  const hasItems = cart && cart.items && cart.items.length > 0;
  const rawSubtotal = cart?.total || 0;
  const subscriptionDiscount = isMonthlySubscribed ? rawSubtotal * 0.05 : 0;
  const discountedSubtotal = rawSubtotal - subscriptionDiscount;
  const freeShippingThreshold = 499;
  const isFreeShipping = discountedSubtotal >= freeShippingThreshold;
  const deliveryFee = isFreeShipping ? 0 : 50;
  const finalTotal = discountedSubtotal + deliveryFee;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - discountedSubtotal);

  // 1-Click WhatsApp Direct Order
  const handleWhatsAppCheckout = () => {
    if (!cart || !cart.items || cart.items.length === 0) return;
    const waNumber = "919480123456";
    let itemList = cart.items
      .map((item, idx) => `${idx + 1}. *${item.product.name}* × ${item.quantity} (₹${(item.product.price * item.quantity).toFixed(2)})`)
      .join("\n");

    const subText = isMonthlySubscribed ? "\n🔄 *Order Type:* Monthly Subscription (5% Discount Applied)" : "";
    const msg = `🛒 *New Order from Website - Desiri Naturals*\n\n` +
      `*Items in Basket:*\n${itemList}\n\n` +
      `*Subtotal:* ₹${discountedSubtotal.toFixed(2)}\n` +
      `*Delivery:* ${isFreeShipping ? "FREE" : "₹50.00"}\n` +
      `*Grand Total:* ₹${finalTotal.toFixed(2)}${subText}\n\n` +
      `📍 *Delivery PIN:* ${pincodeData.pincode} (${pincodeData.city}, ${pincodeData.state})\n` +
      `⚡ *Expected Slot:* ${pincodeData.deliveryPromise}\n\n` +
      `Please send payment QR / UPI link and confirm my order!`;

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Your Basket</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pure Mara Chekku cold-pressed oils & farm harvest
          </p>
        </div>
        {hasItems && (
          <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
            <span>Delivering to <strong>{pincodeData.pincode}</strong></span>
          </div>
        )}
      </div>
      
      {!hasItems ? (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed p-8">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-40" />
          <h2 className="text-2xl font-serif font-bold mb-2">Your basket is empty</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Experience 100% natural cold-pressed oils, unpolished native millets, and Vedic Gir cow ghee.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="rounded-full bg-emerald-700 hover:bg-emerald-800" asChild>
              <Link href="/products">Shop Pure Staples</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" asChild>
              <Link href="/boxes">Build Monthly Box (10% OFF)</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Item List Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Delivery Meter */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 mb-2">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-emerald-700" />
                  {isFreeShipping ? "🎉 You've unlocked FREE Farm Delivery!" : `Add ₹${amountNeededForFreeShipping.toFixed(0)} more for FREE Delivery`}
                </span>
                <span>{Math.min(100, Math.round((discountedSubtotal / freeShippingThreshold) * 100))}%</span>
              </div>
              <div className="h-2 bg-emerald-200/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (discountedSubtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-card border rounded-3xl p-6 shadow-xs">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-border">
                  {cart.items.map((item) => (
                    <li key={item.productId} className="flex py-6 items-center">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border bg-[#fafafa] dark:bg-muted/20 p-2 flex items-center justify-center">
                        <img 
                          src={resolveProductImage(item.product.imageUrl, item.product.name, item.product.categorySlug)} 
                          alt={item.product.name} 
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            const t = e.currentTarget;
                            if (!t.dataset.fallback) {
                              t.dataset.fallback = "1";
                              t.src = "/images/desiri-tin-can.png";
                            }
                          }}
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-sm sm:text-base font-medium text-foreground">
                            <h3 className="font-serif">
                              <Link href={`/products/${item.productId}`} className="hover:text-emerald-700 transition-colors">
                                {item.product.name}
                              </Link>
                            </h3>
                            <p className="ml-4 font-bold text-emerald-800 dark:text-emerald-400">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.product.unit} • {item.product.farmName || "Karnataka Groves"}
                          </p>
                        </div>

                        <div className="flex flex-1 items-end justify-between text-sm mt-3">
                          <div className="flex items-center gap-3 bg-muted rounded-full px-2.5 py-1 border">
                            <button 
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updateItem.isPending}
                              className="p-1 hover:bg-background rounded-full transition-colors disabled:opacity-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-semibold text-xs w-5 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                              disabled={updateItem.isPending}
                              className="p-1 hover:bg-background rounded-full transition-colors disabled:opacity-50"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button 
                            type="button" 
                            onClick={() => handleRemove(item.productId)}
                            disabled={removeItem.isPending}
                            className="text-xs font-medium text-destructive hover:text-destructive/80 flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Subscribe Basket Monthly Option */}
            <div 
              onClick={() => setIsMonthlySubscribed(!isMonthlySubscribed)}
              className={`cursor-pointer rounded-2xl border p-4 flex items-center justify-between transition-all ${
                isMonthlySubscribed 
                  ? "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-600/20"
                  : "border-gray-200 dark:border-border hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <RefreshCw className={`h-4 w-4 ${isMonthlySubscribed ? "animate-spin-reverse" : ""}`} />
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-foreground">
                    Convert Basket to Monthly Auto-Subscription (Save 5%)
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    Get these items delivered to your doorstep every 30 days automatically. Pause or cancel anytime.
                  </span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                isMonthlySubscribed ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"
              }`}>
                {isMonthlySubscribed && <Check className="h-3 w-3" />}
              </div>
            </div>
          </div>
          
          {/* Order Summary Sticky Column */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-3xl p-6 border shadow-sm sticky top-24 space-y-5">
              <h2 className="text-lg font-bold font-serif">Order Summary</h2>
              
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items Total ({cart.items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                  <span className="font-mono">₹{rawSubtotal.toFixed(2)}</span>
                </div>

                {isMonthlySubscribed && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Monthly Subscription Savings (5%)</span>
                    <span>-₹{subscriptionDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>Farm Delivery to {pincodeData.pincode}</span>
                  <span className={`font-semibold ${isFreeShipping ? "text-emerald-700" : ""}`}>
                    {isFreeShipping ? "FREE" : "₹50.00"}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-foreground">Grand Total</span>
                  <span className="text-2xl font-bold font-sans text-emerald-700">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Actions */}
              <div className="space-y-2.5 pt-2">
                <Button 
                  className="w-full bg-[#196b37] hover:bg-[#145a2e] text-white rounded-xl h-12 text-sm font-semibold group shadow-xs" 
                  onClick={() => setLocation("/checkout")}
                >
                  Proceed to Online Checkout
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white font-semibold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs sm:text-sm transition-all h-11"
                >
                  <MessageCircle className="h-4 w-4" />
                  Order Instantly via WhatsApp
                </button>
              </div>

              <div className="text-[11px] text-muted-foreground pt-3 border-t space-y-1">
                <p className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  100% Food Safety & Freshness Guaranteed
                </p>
                <p className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  {pincodeData.deliveryPromise}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
