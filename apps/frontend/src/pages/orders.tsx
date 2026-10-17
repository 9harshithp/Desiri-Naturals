import React from "react";
import { useListOrders } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Package, ChevronRight, Clock, MapPin, FileText, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const { data: orders, isLoading } = useListOrders();

  if (isLoading) {
    return <div className="p-12 text-center text-sm text-muted-foreground">Loading your orders...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'out_for_delivery': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-50 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">Your Order History</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track farm-to-door deliveries, view payment receipts, and download GST tax invoices.
          </p>
        </div>
        <Link href="/products">
          <Button variant="outline" size="sm" className="text-xs font-semibold">
            Shop More Produce
          </Button>
        </Link>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/80">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-40" />
          <h2 className="text-xl font-serif font-bold mb-1">No orders yet</h2>
          <p className="text-xs text-muted-foreground mb-6">When you place an order, it will appear here with live tracking.</p>
          <Link href="/products">
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs">
              Explore Bull-Driven Oils & Produce
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border/80 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-md hover:border-emerald-600/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-base">Order #{order.id}</h3>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground uppercase font-medium">Grand Total</div>
                    <span className="font-serif font-bold text-lg text-emerald-700 dark:text-emerald-400">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items strip & Actions */}
              <div className="border-t pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex -space-x-2.5 overflow-hidden">
                  {order.items.slice(0, 5).map((item, i) => (
                    <div key={i} className="inline-block h-10 w-10 rounded-xl ring-2 ring-background bg-muted overflow-hidden border">
                      <img
                        src={item.imageUrl || "/images/hero.png"}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 5 && (
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-2 ring-background bg-muted text-xs font-bold text-muted-foreground border">
                      +{order.items.length - 5}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/api/orders/${order.id}/invoice`, "_blank", "noopener,noreferrer")}
                    className="h-8 text-xs font-semibold gap-1 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                  >
                    <FileText className="h-3.5 w-3.5" /> GST Invoice
                  </Button>

                  <Link href={`/orders/${order.id}`}>
                    <Button
                      size="sm"
                      className="h-8 text-xs font-semibold gap-1 bg-emerald-700 hover:bg-emerald-800 text-white"
                    >
                      Track Order <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
