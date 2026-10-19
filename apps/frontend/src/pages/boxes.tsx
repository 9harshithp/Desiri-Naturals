import { useState } from "react";
import { useListBoxes, useListProducts, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, Package, Check, RefreshCw, Sparkles, Plus, CheckCircle2, ShoppingBag, ShieldCheck, ArrowRight, Trash2 } from "lucide-react";
import { resolveProductImage } from "@/lib/productImages";
import { useToast } from "@/hooks/use-toast";

export default function Boxes() {
  const { data: boxes, isLoading } = useListBoxes();
  const { data: allProducts } = useListProducts();
  const [activeTab, setActiveTab] = useState<"curated" | "custom">("custom");
  const { toast } = useToast();
  const addToCart = useAddToCart();
  const queryClient = useQueryClient();

  // Custom Box Builder State:
  // Slot 1: Oils (1 or 2 items)
  // Slot 2: Ghee / Honey (1 item)
  // Slot 3: Millets / Staples / Soaps (up to 2 items)
  const [selectedOilId, setSelectedOilId] = useState<number | null>(null);
  const [selectedGheeId, setSelectedGheeId] = useState<number | null>(null);
  const [selectedStapleIds, setSelectedStapleIds] = useState<number[]>([]);
  const [frequency, setFrequency] = useState<"monthly" | "biweekly" | "one-time">("monthly");
  const [isAddingBox, setIsAddingBox] = useState(false);

  // Filter products for builder slots
  const oilProducts = allProducts?.filter(p => 
    p.categorySlug === "cooking-oil" || 
    p.name.toLowerCase().includes("oil")
  ).slice(0, 8) || [];

  const gheeProducts = allProducts?.filter(p => 
    p.categorySlug === "dairy" || 
    p.name.toLowerCase().includes("ghee") || 
    p.name.toLowerCase().includes("honey")
  ).slice(0, 6) || [];

  const stapleProducts = allProducts?.filter(p => 
    p.categorySlug === "millets" || 
    p.categorySlug === "grains" || 
    p.categorySlug === "spices" || 
    p.categorySlug === "body-care" ||
    p.name.toLowerCase().includes("millet") ||
    p.name.toLowerCase().includes("rice") ||
    p.name.toLowerCase().includes("soap")
  ).slice(0, 10) || [];

  // Default selections once products load
  if (oilProducts.length > 0 && selectedOilId === null) {
    setSelectedOilId(oilProducts[0].id);
  }
  if (gheeProducts.length > 0 && selectedGheeId === null) {
    setSelectedGheeId(gheeProducts[0].id);
  }
  if (stapleProducts.length >= 2 && selectedStapleIds.length === 0) {
    setSelectedStapleIds([stapleProducts[0].id, stapleProducts[1].id]);
  }

  const selectedOil = allProducts?.find(p => p.id === selectedOilId);
  const selectedGhee = allProducts?.find(p => p.id === selectedGheeId);
  const selectedStaples = allProducts?.filter(p => selectedStapleIds.includes(p.id)) || [];

  const selectedItems = [
    selectedOil,
    selectedGhee,
    ...selectedStaples
  ].filter(Boolean);

  const rawTotal = selectedItems.reduce((acc, p) => acc + (p?.price || 0), 0);
  const discountRate = 0.10; // 10% combo discount
  const savings = rawTotal * discountRate;
  const comboPrice = rawTotal - savings;

  const toggleStaple = (id: number) => {
    setSelectedStapleIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleAddCustomBoxToCart = async () => {
    if (selectedItems.length === 0) {
      toast({ title: "Please select items for your custom box", variant: "destructive" });
      return;
    }

    setIsAddingBox(true);
    try {
      for (const item of selectedItems) {
        if (!item) continue;
        await addToCart.mutateAsync({
          data: { productId: item.id, quantity: 1 }
        });
      }
      queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      toast({
        title: "🎉 Desiri Monthly Box Added to Cart!",
        description: `${selectedItems.length} items added with your 10% Combo Savings (Saved ₹${savings.toFixed(0)})!`,
      });
    } catch (err) {
      toast({
        title: "Failed to add box",
        description: "Please try again or add items individually.",
        variant: "destructive"
      });
    } finally {
      setIsAddingBox(false);
    }
  };

  if (isLoading) return <div className="p-12 text-center text-muted-foreground font-medium">Loading subscription boxes...</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <Badge variant="outline" className="mb-3 text-emerald-800 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Sparkles className="h-3.5 w-3.5 mr-1" /> Desiri Naturals Fresh Subscriptions
        </Badge>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-foreground">
          Fresh harvests, delivered on your schedule.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Cold-pressed wood churned oils, Gir cow A2 ghee, and unpolished millets directly from Karnataka farms to your kitchen.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex items-center gap-1 bg-muted p-1.5 rounded-full mt-8 border border-border/80">
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "custom"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🪵 Build Your Custom Box (10% OFF)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("curated")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "curated"
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📦 Pre-Curated Subscription Boxes
          </button>
        </div>
      </div>

      {/* TAB 1: CUSTOM COMBO BUILDER */}
      {activeTab === "custom" && (
        <div className="max-w-6xl mx-auto">
          {/* Hero Banner for Custom Box */}
          <div className="bg-linear-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 mb-10 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="bg-emerald-600/80 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Monthly Ration Box
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-3 mb-2">
                Personalize Your Family's Pure Kitchen Box
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                Pick your staple wood-pressed cooking oils, pure A2 ghee, and organic millets. Get an automatic <strong>10% Combo Discount</strong> + Free Bengaluru / Karnataka delivery.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step Selection Column (2 Cols) */}
            <div className="lg:col-span-2 space-y-10">
              {/* STEP 1: Cooking Oil */}
              <div className="bg-card border rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                      1
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-bold">Pick Your Primary Wood-Pressed Oil</h3>
                      <p className="text-xs text-muted-foreground">Cold-pressed below 40°C in traditional wooden Mara Chekku</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Required (1)</Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {oilProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedOilId(p.id)}
                      className={`cursor-pointer rounded-2xl border p-3 flex items-center gap-3 transition-all ${
                        selectedOilId === p.id
                          ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-600/20"
                          : "border-gray-200 dark:border-border hover:border-gray-300"
                      }`}
                    >
                      <div className="w-14 h-14 bg-white dark:bg-muted rounded-xl p-1 shrink-0 flex items-center justify-center border">
                        <img
                          src={resolveProductImage(p.imageUrl, p.name, p.categorySlug)}
                          alt={p.name}
                          className="max-h-12 w-auto object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-gray-900 dark:text-foreground line-clamp-1">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">{p.unit}</p>
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">₹{p.price}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedOilId === p.id ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"
                      }`}>
                        {selectedOilId === p.id && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 2: Ghee / Honey */}
              <div className="bg-card border rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                      2
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-bold">Choose Pure Desi Ghee or Honey</h3>
                      <p className="text-xs text-muted-foreground">Bilona-churned Gir cow cultured ghee or raw forest honey</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Required (1)</Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {gheeProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedGheeId(p.id)}
                      className={`cursor-pointer rounded-2xl border p-3 flex items-center gap-3 transition-all ${
                        selectedGheeId === p.id
                          ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-600/20"
                          : "border-gray-200 dark:border-border hover:border-gray-300"
                      }`}
                    >
                      <div className="w-14 h-14 bg-white dark:bg-muted rounded-xl p-1 shrink-0 flex items-center justify-center border">
                        <img
                          src={resolveProductImage(p.imageUrl, p.name, p.categorySlug)}
                          alt={p.name}
                          className="max-h-12 w-auto object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-gray-900 dark:text-foreground line-clamp-1">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">{p.unit}</p>
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">₹{p.price}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedGheeId === p.id ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"
                      }`}>
                        {selectedGheeId === p.id && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 3: Millets / Staples / Soaps */}
              <div className="bg-card border rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                      3
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-bold">Select 2 Millets, Grains, or Body Care</h3>
                      <p className="text-xs text-muted-foreground">Unpolished native grains and chemical-free soaps</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">{selectedStapleIds.length}/2 Selected</Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {stapleProducts.map(p => {
                    const isSelected = selectedStapleIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleStaple(p.id)}
                        className={`cursor-pointer rounded-2xl border p-3 flex items-center gap-3 transition-all ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-600/20"
                            : "border-gray-200 dark:border-border hover:border-gray-300"
                        }`}
                      >
                        <div className="w-14 h-14 bg-white dark:bg-muted rounded-xl p-1 shrink-0 flex items-center justify-center border">
                          <img
                            src={resolveProductImage(p.imageUrl, p.name, p.categorySlug)}
                            alt={p.name}
                            className="max-h-12 w-auto object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs text-gray-900 dark:text-foreground line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground">{p.unit}</p>
                          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">₹{p.price}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"
                        }`}>
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Box Summary & Price Breakdown Column (1 Col Sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-3xl p-6 shadow-md sticky top-24 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                      <Package className="h-5 w-5 text-emerald-700" /> Your Desiri Crate
                    </h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      10% Off Applied
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Packed fresh in eco-friendly protective packaging.
                  </p>
                </div>

                {/* Selected Items List */}
                <div className="space-y-3 border-y py-4 divide-y divide-border/60">
                  {selectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between pt-2 first:pt-0 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium text-gray-800 dark:text-foreground line-clamp-1">
                          {item?.name}
                        </span>
                      </div>
                      <span className="font-mono text-muted-foreground ml-2 shrink-0">₹{item?.price}</span>
                    </div>
                  ))}
                  {selectedItems.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">No items selected yet.</p>
                  )}
                </div>

                {/* Delivery Frequency Option */}
                <div>
                  <label className="text-xs font-bold block mb-2 text-foreground">Delivery Schedule</label>
                  <div className="grid grid-cols-3 gap-1.5 bg-muted p-1 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setFrequency("monthly")}
                      className={`py-1.5 rounded-lg font-semibold transition-all ${
                        frequency === "monthly" ? "bg-white dark:bg-card shadow-xs text-emerald-700" : "text-muted-foreground"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency("biweekly")}
                      className={`py-1.5 rounded-lg font-semibold transition-all ${
                        frequency === "biweekly" ? "bg-white dark:bg-card shadow-xs text-emerald-700" : "text-muted-foreground"
                      }`}
                    >
                      Every 2 Wks
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency("one-time")}
                      className={`py-1.5 rounded-lg font-semibold transition-all ${
                        frequency === "one-time" ? "bg-white dark:bg-card shadow-xs text-emerald-700" : "text-muted-foreground"
                      }`}
                    >
                      One-Time
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-muted/40 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Individual MRP Total</span>
                    <span className="line-through font-mono">₹{rawTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span>Desiri Box Combo Discount (10%)</span>
                    <span>-₹{savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Fresh Farm Delivery</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center text-sm font-bold text-foreground">
                    <span>Total Box Price</span>
                    <span className="text-xl font-bold text-emerald-700 font-sans">₹{comboPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <Button
                  size="lg"
                  className="w-full bg-[#196b37] hover:bg-[#145a2e] text-white font-semibold rounded-2xl h-13 text-sm shadow-md flex items-center justify-center gap-2"
                  onClick={handleAddCustomBoxToCart}
                  disabled={isAddingBox || selectedItems.length === 0}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {isAddingBox ? "Packing Your Box..." : `Add Custom Box to Cart (₹${comboPrice.toFixed(0)})`}
                </Button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% Cold Pressed
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="h-3.5 w-3.5 text-emerald-600" /> Cancel Anytime
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURATED SUBSCRIPTION BOXES */}
      {activeTab === "curated" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Array.isArray(boxes) && boxes.map((box) => (
            <div key={box.id} className={`relative flex flex-col bg-card rounded-3xl border ${box.isPopular ? 'border-primary shadow-lg scale-105 z-10' : 'shadow-sm'} overflow-hidden`}>
              {box.isPopular && (
                <div className="bg-primary text-primary-foreground text-xs font-bold text-center py-1.5 tracking-wider uppercase">
                  Most Popular
                </div>
              )}
              
              <div className="p-8 pb-0">
                <h2 className="font-serif text-2xl font-bold mb-2">{box.name}</h2>
                <p className="text-muted-foreground text-sm mb-6 h-10">{box.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">₹{box.price}</span>
                  <span className="text-muted-foreground font-medium"> / {box.frequency}</span>
                </div>

                {box.highlight && (
                  <div className="bg-secondary/10 text-secondary-foreground text-sm px-4 py-3 rounded-xl mb-8 flex items-start gap-3">
                    <Leaf className="h-5 w-5 text-secondary shrink-0" />
                    <span className="font-medium">{box.highlight}</span>
                  </div>
                )}
              </div>

              <div className="p-8 pt-0 flex-1 flex flex-col">
                <div className="flex-1">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">What's Inside</h4>
                  <ul className="space-y-3 mb-8">
                    {box.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className="bg-primary/10 p-1 rounded-full text-primary mt-0.5 shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  size="lg" 
                  className={`w-full rounded-full h-14 ${box.isPopular ? '' : 'bg-muted text-foreground hover:bg-muted/80 border'}`}
                  onClick={() => {
                    toast({
                      title: `Subscribed to ${box.name}!`,
                      description: `Delivered ${box.frequency}. You can pause or cancel anytime.`,
                    });
                  }}
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Flexibility Guarantee */}
      <div className="mt-20 max-w-4xl mx-auto bg-muted/50 rounded-3xl p-8 md:p-12 border flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
          <RefreshCw className="h-10 w-10 text-emerald-700" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold mb-2">Total Monthly Flexibility</h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Going on vacation? Having guests over? You can easily pause, skip, or modify your subscription size at any time through WhatsApp or your account. No lock-in, just pure unadulterated farm food when you need it.
          </p>
        </div>
      </div>
    </div>
  );
}

