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
import { Leaf, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  deliveryAddress: z.string().min(10, "Full address required"),
  deliveryDate: z.string().optional(),
  notes: z.string().optional(),
});

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { data: cart, isLoading: cartLoading } = useGetCart();
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      deliveryAddress: "",
      notes: "",
      deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
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

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    createOrder.mutate(
      { data: values },
      {
        onSuccess: (order) => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          toast({ title: "Order placed successfully!" });
          setLocation(`/orders/${order.id}`);
        },
        onError: () => {
          toast({ title: "Error placing order", variant: "destructive" });
        }
      }
    );
  };

  const deliveryFee = cart.total > 500 ? 0 : 50;
  const finalTotal = cart.total + deliveryFee;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      <Link href="/cart" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
      </Link>
      
      <h1 className="font-serif text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
        <div>
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Delivery Details</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="bg-muted/50" />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 98765 43210" {...field} className="bg-muted/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complete Delivery Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Apartment, Street, Area, City, Pincode" {...field} className="bg-muted/50 min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Notes (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Leave with security guard" {...field} className="bg-muted/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" size="lg" className="w-full rounded-full h-14 text-lg mt-8" disabled={createOrder.isPending}>
                {createOrder.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Place Order • ₹{finalTotal.toFixed(2)}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <div className="bg-muted/30 border rounded-3xl p-8 sticky top-24">
            <h2 className="text-xl font-bold mb-6 font-serif">Order Summary</h2>
            
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-muted rounded-xl overflow-hidden border shrink-0">
                    {item.product.imageUrl && <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {item.product.unit}</p>
                  </div>
                  <div className="font-medium text-sm">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between pt-4 border-t items-center">
                <span className="font-bold text-base">Total to Pay</span>
                <span className="font-serif font-bold text-2xl text-primary">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-primary font-medium bg-primary/5 py-3 rounded-full">
              <Leaf className="h-4 w-4" /> 100% Farm Fresh Guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
