import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetCart, useUpdateCartItem, useRemoveFromCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const [, setLocation] = useLocation();
  const { data: cart, isLoading } = useGetCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  if (isLoading) return <div className="p-12 text-center">Loading cart...</div>;

  const hasItems = cart && cart.items && cart.items.length > 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
      <h1 className="font-serif text-4xl font-bold mb-8">Your Basket</h1>
      
      {!hasItems ? (
        <div className="text-center py-24 bg-muted/30 rounded-2xl border border-dashed">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl font-serif font-bold mb-2">Your basket is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any fresh produce yet.</p>
          <Button size="lg" className="rounded-full" asChild>
            <Link href="/products">Shop Fresh Produce</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-2xl p-6">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-border">
                  {cart.items.map((item) => (
                    <li key={item.productId} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border bg-muted">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover object-center" />
                        ) : (
                          <div className="h-full w-full bg-secondary/20" />
                        )}
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-foreground">
                            <h3 className="font-serif"><Link href={`/products/${item.productId}`}>{item.product.name}</Link></h3>
                            <p className="ml-4">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{item.product.farmName}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center gap-3 bg-muted rounded-full px-2 py-1">
                            <button 
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updateItem.isPending}
                              className="p-1 hover:bg-background rounded-full transition-colors disabled:opacity-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-medium w-4 text-center">{item.quantity}</span>
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
                            className="font-medium text-destructive hover:text-destructive/80 flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-muted/50 rounded-2xl p-6 border sticky top-24">
              <h2 className="text-lg font-bold mb-4 font-serif">Order Summary</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium text-primary">
                    {cart.total > 500 ? 'Free' : '₹50.00'}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-xl font-bold font-serif">
                    ₹{(cart.total + (cart.total > 500 ? 0 : 50)).toFixed(2)}
                  </span>
                </div>
              </div>
              <Button className="w-full mt-8 rounded-full h-12 text-base group" onClick={() => setLocation("/checkout")}>
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Secure checkout. Freshness guaranteed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
