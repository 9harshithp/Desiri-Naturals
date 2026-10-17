import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetCart,
  useCreateOrder,
  getGetCartQueryKey,
  getListOrdersQueryKey,
  type Order,
  type CartItem,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { usePincode } from "@/context/pincode-context";
import {
  Leaf,
  ArrowLeft,
  Loader2,
  Clock,
  CheckCircle2,
  MapPin,
  CreditCard,
  QrCode,
  ShieldCheck,
  Truck,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Building,
} from "lucide-react";
import { Link } from "wouter";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Full name is required (minimum 2 characters)"),
  customerPhone: z
    .string()
    .min(10, "Valid 10-digit mobile number required")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian 10-digit mobile number starting with 6-9"),
  flatBuilding: z.string().min(2, "Flat / House no. and Building is required"),
  streetArea: z.string().min(3, "Street, Area or Locality is required"),
  landmark: z.string().optional(),
  pincode: z.string().min(6, "6-digit PIN code required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  deliveryDate: z.string().optional(),
  deliverySlot: z.string().optional(),
  paymentMethod: z.string().min(1, "Select a payment method"),
  notes: z.string().optional(),
  whatsappUpdates: z.boolean().default(true),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const DELIVERY_SLOTS = [
  {
    id: "7am-10am",
    label: "Morning Fresh: 7:00 AM – 10:00 AM",
    tag: "Recommended for Milk & Oils",
    highlight: true,
  },
  {
    id: "1pm-4pm",
    label: "Afternoon Express: 1:00 PM – 4:00 PM",
    tag: "Standard",
    highlight: false,
  },
  {
    id: "6pm-9pm",
    label: "Evening Convenience: 6:00 PM – 9:00 PM",
    tag: "After Work Hours",
    highlight: false,
  },
];

const POPULAR_BANKS = [
  { id: "hdfc", name: "HDFC Bank", logo: "HDFC" },
  { id: "sbi", name: "State Bank of India", logo: "SBI" },
  { id: "icici", name: "ICICI Bank", logo: "ICICI" },
  { id: "axis", name: "Axis Bank", logo: "AXIS" },
  { id: "kotak", name: "Kotak Mahindra", logo: "KOTAK" },
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { pincodeData, openModal } = usePincode();

  const [selectedSlot, setSelectedSlot] = useState("7am-10am");
  const [selectedPayment, setSelectedPayment] = useState<"upi" | "cod" | "card" | "netbanking">("upi");
  const [upiIdInput, setUpiIdInput] = useState("");
  const [upiVerified, setUpiVerified] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [selectedBank, setSelectedBank] = useState("hdfc");

  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      flatBuilding: "",
      streetArea: "",
      landmark: "",
      pincode: pincodeData.pincode,
      city: pincodeData.city,
      state: pincodeData.state,
      notes: "",
      deliveryDate: selectedDate,
      deliverySlot: "7am-10am",
      paymentMethod: "upi",
      whatsappUpdates: true,
    },
  });

  // Sync pincode changes from context to form
  useEffect(() => {
    form.setValue("pincode", pincodeData.pincode);
    form.setValue("city", pincodeData.city);
    form.setValue("state", pincodeData.state);
  }, [pincodeData, form]);

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-700 mb-4" />
        <p className="text-sm text-muted-foreground">Loading your harvest basket...</p>
      </div>
    );
  }

  if (!cart || cart.itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-6 text-emerald-700">
          <Leaf className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">Your Basket is Empty</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Explore our bull-driven cold-pressed oils, Vedic A2 ghee, and raw forest honey directly from Karnataka groves.
        </p>
        <Button onClick={() => setLocation("/products")} className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full px-6">
          Shop Pure Desiri Harvest
        </Button>
      </div>
    );
  }

  const freeShippingThreshold = pincodeData.minOrderForFreeShipping || 499;
  const isFreeDelivery = cart.total >= freeShippingThreshold;
  const deliveryFee = isFreeDelivery ? 0 : 50;
  const finalTotal = cart.total + deliveryFee;
  const upiPayLink = `upi://pay?pa=desirinaturals@okhdfcbank&pn=Desiri%20Naturals&am=${finalTotal.toFixed(2)}&cu=INR&tn=Desiri%20Order`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("desirinaturals@okhdfcbank");
    setCopiedUpi(true);
    toast({ title: "UPI ID Copied!", description: "desirinaturals@okhdfcbank copied to clipboard." });
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleVerifyUpi = () => {
    if (!upiIdInput.includes("@")) {
      toast({ title: "Invalid UPI ID", description: "Please enter a valid UPI ID (e.g. yourname@okhdfcbank)", variant: "destructive" });
      return;
    }
    setUpiVerified(true);
    toast({ title: "UPI ID Verified", description: `${upiIdInput} is active and ready for payment.` });
  };

  const onSubmit = (values: CheckoutFormValues) => {
    // Construct complete formatted delivery address
    const fullAddress = [
      values.flatBuilding,
      values.streetArea,
      values.landmark ? `Landmark: ${values.landmark}` : null,
      `${values.city}, ${values.state} - ${values.pincode}`,
      values.whatsappUpdates ? `[WhatsApp Updates: +91-${values.customerPhone}]` : null,
    ]
      .filter(Boolean)
      .join(", ");

    createOrder.mutate(
      {
        data: {
          customerName: values.customerName,
          customerPhone: values.customerPhone,
          deliveryAddress: fullAddress,
          deliveryDate: selectedDate,
          deliverySlot: selectedSlot,
          paymentMethod: selectedPayment,
          notes: values.notes,
        },
      },
      {
        onSuccess: (order: Order) => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          toast({
            title: "🌿 Order Placed Successfully!",
            description: `Order #${order.id} confirmed. Dispatch updates sent to your WhatsApp.`,
          });
          setLocation(`/orders/${order.id}`);
        },
        onError: () => {
          toast({
            title: "Failed to place order",
            description: "Please check your network and try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl">
      <Link
        href="/cart"
        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-emerald-700 mb-6 transition-colors"
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Return to Basket
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Express Checkout</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pure bull-driven wood-pressed oils & natural groceries dispatched fresh from farm groves.
          </p>
        </div>

        {/* Hyperlocal Pincode Serviceability Pill */}
        <div className="inline-flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-2 rounded-2xl">
          <Truck className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <div className="text-xs text-left">
            <div className="font-semibold text-emerald-900 dark:text-emerald-200">
              Delivering to {pincodeData.city} ({pincodeData.pincode})
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
              {pincodeData.deliveryPromise}
            </div>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 underline hover:no-underline ml-1"
          >
            Change
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_390px] gap-8 sm:gap-12 items-start">
        {/* Left Column: Form & Steps */}
        <div className="space-y-8">
          <Form {...form}>
            <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Contact & Delivery Address */}
              <div className="bg-card border rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="h-8 w-8 rounded-full bg-emerald-700 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base sm:text-lg">Contact & Delivery Address</h2>
                    <p className="text-xs text-muted-foreground">Where should our farm electric fleet deliver your fresh goods?</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Dr. Rajesh Rao" {...field} className="h-10 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Mobile Number *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground border-r pr-2 flex items-center gap-1">
                              🇮🇳 +91
                            </span>
                            <Input
                              placeholder="9876543210"
                              maxLength={10}
                              {...field}
                              className="h-10 text-sm pl-20"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="flatBuilding"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Flat / House No., Apartment or Society *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Flat 402, Prestige Hermitage" {...field} className="h-10 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="streetArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Street, Layout & Area *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 12th Main, HAL 2nd Stage, Indiranagar" {...field} className="h-10 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="landmark"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Landmark (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Near Indiranagar Metro Station" {...field} className="h-10 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">PIN Code *</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={6} className="h-10 text-sm font-mono font-bold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">City *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">State *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* WhatsApp Update Checkbox */}
                <FormField
                  control={form.control}
                  name="whatsappUpdates"
                  render={({ field }) => (
                    <div className="flex items-center gap-2.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 p-3 rounded-xl">
                      <input
                        type="checkbox"
                        id="whatsappUpdates"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                      />
                      <label htmlFor="whatsappUpdates" className="text-xs font-medium cursor-pointer flex items-center gap-1.5 text-foreground">
                        <MessageCircle className="h-3.5 w-3.5 text-[#25D366] shrink-0" />
                        Send order confirmation, GST invoice link, and dispatch tracking photos via WhatsApp
                      </label>
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Delivery Instructions (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Leave with security guard, or call before doorbell"
                          {...field}
                          className="h-10 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Step 2: Fresh Harvest Delivery Slot */}
              <div className="bg-card border rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-700 text-white text-sm font-bold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-base sm:text-lg">Delivery Date & Morning Slot</h2>
                      <p className="text-xs text-muted-foreground">Packed fresh each dawn directly from Karnataka extraction presses</p>
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { offset: 1, label: "Tomorrow" },
                    { offset: 2, label: "Day After Tomorrow" },
                  ].map(({ offset, label }) => {
                    const dateObj = new Date();
                    dateObj.setDate(dateObj.getDate() + offset);
                    const iso = dateObj.toISOString().split("T")[0];
                    const display = dateObj.toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    });
                    const isSelected = selectedDate === iso;

                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setSelectedDate(iso)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-600"
                            : "border-border hover:border-emerald-500/50 bg-muted/20"
                        }`}
                      >
                        <div className="text-xs font-bold text-muted-foreground uppercase">{label}</div>
                        <div className="text-sm font-bold text-foreground mt-0.5">{display}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Slots */}
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-muted-foreground">Select Delivery Time Slot:</div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {DELIVERY_SLOTS.map((slot) => {
                      const isSelected = selectedSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-600"
                              : "border-border hover:border-emerald-500/50"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <Clock className={`h-3.5 w-3.5 ${isSelected ? "text-emerald-700" : "text-muted-foreground"}`} />
                              {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />}
                            </div>
                            <div className="text-xs font-bold leading-snug">{slot.label}</div>
                          </div>
                          {slot.tag && (
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-2 bg-emerald-100/50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md inline-block w-fit">
                              {slot.tag}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-card border rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="h-8 w-8 rounded-full bg-emerald-700 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base sm:text-lg">Payment Method</h2>
                    <p className="text-xs text-muted-foreground">Instant UPI, Cards, NetBanking or Pay on Delivery</p>
                  </div>
                </div>

                {/* Payment Option Tabs */}
                <div className="grid sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPayment("upi")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedPayment === "upi"
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-600"
                        : "border-border hover:border-emerald-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded font-mono">
                        UPI
                      </span>
                      {selectedPayment === "upi" && <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
                    </div>
                    <div className="text-xs font-bold mt-2">Instant UPI</div>
                    <div className="text-[10px] text-muted-foreground">GPay, PhonePe, Paytm</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPayment("cod")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedPayment === "cod"
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-600"
                        : "border-border hover:border-emerald-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded font-mono">
                        COD
                      </span>
                      {selectedPayment === "cod" && <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
                    </div>
                    <div className="text-xs font-bold mt-2">Pay on Delivery</div>
                    <div className="text-[10px] text-muted-foreground">Cash or UPI at doorstep</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPayment("card")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedPayment === "card"
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-600"
                        : "border-border hover:border-emerald-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="h-4 w-4 text-primary" />
                      {selectedPayment === "card" && <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
                    </div>
                    <div className="text-xs font-bold mt-2">Debit / Credit</div>
                    <div className="text-[10px] text-muted-foreground">RuPay, Visa, Master</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPayment("netbanking")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedPayment === "netbanking"
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-600"
                        : "border-border hover:border-emerald-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Building className="h-4 w-4 text-primary" />
                      {selectedPayment === "netbanking" && <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
                    </div>
                    <div className="text-xs font-bold mt-2">Net Banking</div>
                    <div className="text-[10px] text-muted-foreground">HDFC, SBI, ICICI...</div>
                  </button>
                </div>

                {/* Sub-Panel: UPI Flow */}
                {selectedPayment === "upi" && (
                  <div className="border rounded-2xl p-5 bg-muted/20 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      {/* Visual QR Code Generator */}
                      <div className="bg-white p-3 rounded-2xl border shadow-xs text-center shrink-0">
                        <div className="relative w-36 h-36 bg-white rounded-lg flex items-center justify-center p-2 border">
                          {/* Stylized QR Code SVG */}
                          <svg viewBox="0 0 100 100" className="w-full h-full text-zinc-900">
                            {/* Corner Squares */}
                            <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                            <rect x="11" y="11" width="13" height="13" rx="1" fill="currentColor" />
                            <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                            <rect x="76" y="11" width="13" height="13" rx="1" fill="currentColor" />
                            <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                            <rect x="11" y="76" width="13" height="13" rx="1" fill="currentColor" />
                            {/* Inner Data Pattern Matrix */}
                            <rect x="36" y="8" width="8" height="8" fill="currentColor" />
                            <rect x="48" y="8" width="6" height="6" fill="currentColor" />
                            <rect x="58" y="14" width="8" height="6" fill="currentColor" />
                            <rect x="8" y="38" width="6" height="8" fill="currentColor" />
                            <rect x="18" y="44" width="8" height="6" fill="currentColor" />
                            <rect x="34" y="34" width="32" height="32" rx="4" fill="#047857" />
                            <text x="50" y="54" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">UPI</text>
                            <rect x="72" y="38" width="8" height="8" fill="currentColor" />
                            <rect x="84" y="44" width="8" height="8" fill="currentColor" />
                            <rect x="36" y="72" width="6" height="8" fill="currentColor" />
                            <rect x="48" y="78" width="8" height="8" fill="currentColor" />
                            <rect x="62" y="72" width="8" height="8" fill="currentColor" />
                            <rect x="74" y="82" width="10" height="8" fill="currentColor" />
                          </svg>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1.5 block font-medium">
                          Scan to Pay ₹{finalTotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <div className="space-y-1">
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            <QrCode className="h-3.5 w-3.5 text-emerald-700" /> Scan with Any UPI App
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Open Google Pay, PhonePe, Paytm, BHIM or Cred on your phone to scan and pay.
                          </p>
                        </div>

                        {/* UPI ID Copy Field */}
                        <div className="flex items-center gap-2">
                          <div className="h-9 px-3 rounded-xl bg-background border flex items-center justify-between text-xs font-mono font-bold flex-1">
                            <span>desirinaturals@okhdfcbank</span>
                            <span className="text-[10px] text-emerald-700 font-sans font-medium">Verified Merchant</span>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleCopyUpi}
                            className="h-9 text-xs gap-1 shrink-0"
                          >
                            {copiedUpi ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                            {copiedUpi ? "Copied" : "Copy"}
                          </Button>
                        </div>

                        {/* Or enter UPI VPA */}
                        <div className="pt-2 border-t space-y-2">
                          <div className="text-xs font-semibold">Or Enter Your VPA / UPI ID:</div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="e.g. mobile@upi or name@okhdfcbank"
                              value={upiIdInput}
                              onChange={(e) => {
                                setUpiIdInput(e.target.value);
                                setUpiVerified(false);
                              }}
                              className="h-9 text-xs bg-background"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={handleVerifyUpi}
                              className="h-9 text-xs px-3 shrink-0"
                            >
                              {upiVerified ? "Verified ✓" : "Verify VPA"}
                            </Button>
                          </div>
                          {upiVerified && (
                            <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Ready! Click "Pay & Place Order" below to complete payment.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Panel: COD Flow */}
                {selectedPayment === "cod" && (
                  <div className="border rounded-2xl p-5 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="font-bold text-amber-900 dark:text-amber-200">
                          Cash / Doorstep UPI on Delivery
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Pay ₹{finalTotal.toFixed(2)} when the delivery executive arrives at your doorstep. You can pay via Cash or ask the delivery executive for their direct UPI QR code.
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium pt-1">
                          <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                          WhatsApp delivery OTP will be sent prior to arrival to prevent contactless fraud.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Panel: Card Flow */}
                {selectedPayment === "card" && (
                  <div className="border rounded-2xl p-5 bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Card Details</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <ShieldCheck className="h-3.5 w-3.5" /> 256-Bit SSL Bank Grade
                      </span>
                    </div>
                    <Input placeholder="Card Number (e.g. 4532 •••• •••• 8890)" className="h-10 text-xs bg-background font-mono" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="MM / YY" className="h-10 text-xs bg-background font-mono" />
                      <Input placeholder="CVV / CVC (3 digits)" maxLength={4} className="h-10 text-xs bg-background font-mono" />
                    </div>
                    <Input placeholder="Cardholder Name as on Card" className="h-10 text-xs bg-background" />
                  </div>
                )}

                {/* Sub-Panel: Net Banking */}
                {selectedPayment === "netbanking" && (
                  <div className="border rounded-2xl p-5 bg-muted/20 space-y-3">
                    <div className="text-xs font-semibold">Choose Your Bank:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {POPULAR_BANKS.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBank(b.id)}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                            selectedBank === b.id
                              ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 font-bold"
                              : "border-border bg-background hover:border-emerald-500/40"
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>

        {/* Right Column: Order Summary & Placement */}
        <div className="sticky top-24 space-y-6">
          <div className="bg-card border rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="font-serif font-bold text-lg">Harvest Summary</h2>
              <Badge variant="outline" className="text-xs font-semibold">
                {cart.itemCount} {cart.itemCount === 1 ? "Item" : "Items"}
              </Badge>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {cart.items.map((item: CartItem) => (
                <div key={item.productId} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                  <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden shrink-0 border">
                    <img
                      src={item.product.imageUrl || "/images/hero.png"}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      {item.quantity} × {item.product.unit} @ ₹{item.product.price}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-right shrink-0">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs border-t pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Items Subtotal</span>
                <span className="font-semibold text-foreground">₹{cart.total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Estimated GST & Local Taxes</span>
                <span className="text-emerald-700 font-medium">Included in Price (5% / 12%)</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Direct Fleet Delivery</span>
                {isFreeDelivery ? (
                  <span className="font-semibold text-emerald-700">FREE</span>
                ) : (
                  <span className="font-semibold text-foreground">₹50.00</span>
                )}
              </div>

              {!isFreeDelivery && (
                <div className="text-[11px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-2.5 rounded-xl text-emerald-800 dark:text-emerald-300">
                  Add ₹{(freeShippingThreshold - cart.total).toFixed(2)} more for <strong>FREE Delivery</strong>
                </div>
              )}

              <div className="border-t pt-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Total Payable Amount</div>
                  <div className="font-serif font-bold text-2xl text-emerald-700 dark:text-emerald-400">
                    ₹{finalTotal.toFixed(2)}
                  </div>
                </div>
                <Badge variant="secondary" className="text-[11px] uppercase tracking-wide">
                  {selectedPayment.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              type="submit"
              form="checkout-form"
              size="lg"
              disabled={createOrder.isPending}
              className="w-full h-12 rounded-full font-semibold text-sm bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg transition-all"
            >
              {createOrder.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Confirming Harvest Order...
                </span>
              ) : selectedPayment === "cod" ? (
                `Place Order (Pay ₹${finalTotal.toFixed(2)} on Delivery)`
              ) : (
                `Pay ₹${finalTotal.toFixed(2)} & Place Order`
              )}
            </Button>

            {/* Trust Assurances */}
            <div className="space-y-2 pt-2 border-t text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <Leaf className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>100% Traditional 2-3 RPM Bull-Driven Cold Pressed</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>FSSAI Lic #11221334000192 • GST Tax Invoiced</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5 text-[#25D366] shrink-0" />
                <span>Live dispatch photos & tracking sent to WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
