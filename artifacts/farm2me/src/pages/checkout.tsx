import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetCart, useCreateOrder, getGetCartQueryKey, getListOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Leaf, ArrowLeft, Loader2, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  deliveryAddress: z.string().min(10, "Full address required"),
  deliveryDate: z.string().optional(),
  deliverySlot: z.string().optional(),
  paymentMethod: z.string().min(1, "Select a payment method"),
  notes: z.string().optional(),
});

const DELIVERY_SLOTS = [
  { id: "6am-9am", label: "6:00 AM – 9:00 AM", tag: "Early Bird" },
  { id: "9am-12pm", label: "9:00 AM – 12:00 PM", tag: "" },
  { id: "12pm-3pm", label: "12:00 PM – 3:00 PM", tag: "" },
  { id: "5pm-8pm", label: "5:00 PM – 8:00 PM", tag: "Evening" },
];

const PAYMENT_METHODS = [
  {
    id: "upi",
    label: "UPI",
    desc: "GPay, PhonePe, Paytm",
    icon: (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none">
        <rect width="48" height="48" rx="10" fill="#6C3AFF" />
        <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">UPI</text>
      </svg>
    ),
  },
  {
    id: "card",
    label: "Debit / Credit Card",
    desc: "Visa, Mastercard, RuPay",
    icon: (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none">
        <rect width="48" height="48" rx="10" fill="#1a56db" />
        <rect x="8" y="16" width="32" height="6" rx="1" fill="white" opacity="0.8" />
        <rect x="8" y="28" width="10" height="4" rx="1" fill="white" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
    icon: (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none">
        <rect width="48" height="48" rx="10" fill="#15803d" />
        <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">₹</text>
      </svg>
    ),
  },
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState("9am-12pm");
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [paymentDone, setPaymentDone] = useState(false);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      deliveryAddress: "",
      notes: "",
      deliveryDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      deliverySlot: "9am-12pm",
      paymentMethod: "upi",
    },
  });

  if (cartLoading) return <div className="p-12 text-center">Loading...</div>;
  if (!cart || cart.itemCount === 0) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
        <Button onClick={() => setLocation("/products")}>Back to Products</Button>
      </div>
    );
  }

  const deliveryFee = cart.total > 500 ? 0 : 50;
  const finalTotal = cart.total + deliveryFee;

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    createOrder.mutate(
      { data: { ...values, deliverySlot: selectedSlot, paymentMethod: selectedPayment } },
      {
        onSuccess: (order) => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          toast({ title: "Order placed successfully!" });
          setLocation(`/orders/${order.id}`);
        },
        onError: () => {
          toast({ title: "Error placing order", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      <Link href="/cart" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
      </Link>

      <h1 className="font-serif text-4xl font-bold mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-10">
          {/* Delivery Details */}
          <section>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold">1</span>
              Delivery Details
            </h2>
            <Form {...form}>
              <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="customerName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Priya Sharma" {...field} className="h-11 bg-muted/40" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="customerPhone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="+91 98765 43210" {...field} className="h-11 bg-muted/40" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complete Delivery Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Flat/House no., Building, Street, Area, City, Pincode" {...field} className="bg-muted/40 min-h-[90px] resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Notes (optional)</FormLabel>
                    <FormControl><Input placeholder="e.g. Leave with security, Ring twice" {...field} className="h-11 bg-muted/40" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </form>
            </Form>
          </section>

          {/* Delivery Slot */}
          <section>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold">2</span>
              Pick a Delivery Slot
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {DELIVERY_SLOTS.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-left transition-all ${
                    selectedSlot === slot.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <Clock className={`h-4 w-4 shrink-0 ${selectedSlot === slot.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <div className="font-medium text-sm">{slot.label}</div>
                    {slot.tag && <div className="text-xs text-muted-foreground">{slot.tag}</div>}
                  </div>
                  {selectedSlot === slot.id && <CheckCircle2 className="h-4 w-4 text-primary ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-bold">3</span>
              Payment Method
            </h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => { setSelectedPayment(method.id); setPaymentDone(false); }}
                  className={`w-full flex items-center gap-4 border rounded-xl px-5 py-4 text-left transition-all ${
                    selectedPayment === method.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {method.icon}
                  <div className="flex-1">
                    <div className="font-medium">{method.label}</div>
                    <div className="text-xs text-muted-foreground">{method.desc}</div>
                  </div>
                  {selectedPayment === method.id && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                </button>
              ))}
            </div>

            {selectedPayment !== "cod" && (
              <div className="mt-4 p-4 bg-muted/50 border rounded-xl">
                {paymentDone ? (
                  <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    {selectedPayment === "upi" ? "UPI payment verified" : "Card details saved"}
                  </div>
                ) : selectedPayment === "upi" ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Enter UPI ID</p>
                    <div className="flex gap-2">
                      <Input placeholder="yourname@upi" className="h-10 bg-background flex-1" />
                      <Button type="button" variant="outline" size="sm" className="h-10 px-4" onClick={() => setPaymentDone(true)}>
                        Verify
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Input placeholder="1234 5678 9012 3456" className="h-10 bg-background" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="MM / YY" className="h-10 bg-background" />
                      <Input placeholder="CVV" className="h-10 bg-background" />
                    </div>
                    <Button type="button" variant="outline" size="sm" className="w-full h-10" onClick={() => setPaymentDone(true)}>
                      Save Card
                    </Button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-muted/30 border rounded-3xl p-7 sticky top-24">
            <h2 className="text-lg font-bold mb-5 font-serif">Order Summary</h2>

            <div className="space-y-3 mb-6 max-h-[280px] overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="h-14 w-14 bg-muted rounded-xl overflow-hidden border shrink-0">
                    {item.product.imageUrl && (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × {item.product.unit}
                    </p>
                  </div>
                  <div className="font-medium text-sm shrink-0">₹{(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 pt-5 border-t text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? "text-primary font-medium" : ""}>
                  {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                  Add ₹{(500 - cart.total).toFixed(2)} more for free delivery
                </p>
              )}
              <div className="flex justify-between pt-4 border-t items-center">
                <span className="font-bold">Total to Pay</span>
                <span className="font-serif font-bold text-2xl text-primary">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Slot: {DELIVERY_SLOTS.find((s) => s.id === selectedSlot)?.label}
            </div>

            <Button
              type="submit"
              form="checkout-form"
              size="lg"
              className="w-full rounded-full h-13 text-base mt-6"
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {selectedPayment === "cod" ? "Place Order (Pay on Delivery)" : `Pay ₹${finalTotal.toFixed(2)}`}
            </Button>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-primary font-medium">
              <Leaf className="h-3.5 w-3.5" /> 100% Farm Fresh Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
